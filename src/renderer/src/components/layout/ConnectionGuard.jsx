import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import StartupPage from '../../pages/StartupPage'
import { ConnectionContext } from '../../context/ConnectionContext'

export default function ConnectionGuard() {
  const [status, setStatus] = useState('CONNECTING')

  useEffect(() => {
    let active = true

    // Initial check of connection status
    const checkInitialStatus = async () => {
      try {
        const currentStatus = await window.api.db.getConnectionStatus()
        if (active) {
          setStatus(currentStatus)
        }
      } catch (err) {
        console.error('Failed to retrieve initial connection status:', err)
        if (active) {
          setStatus('FAILED')
        }
      }
    }

    checkInitialStatus()

    // Subscribe to database connection state change events
    const unsubscribe = window.api.db.onConnectionStateChanged((newStatus) => {
      if (active) {
        setStatus(newStatus)
      }
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  if (status === 'CONNECTED') {
    return (
      <ConnectionContext.Provider value={status}>
        <Outlet />
      </ConnectionContext.Provider>
    )
  }

  // Fallback to StartupPage which handles the pipeline (Connecting, Error, Config Manager)
  return (
    <ConnectionContext.Provider value={status}>
      <StartupPage status={status} />
    </ConnectionContext.Provider>
  )
}
