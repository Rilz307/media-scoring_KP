import { useState, useEffect, useCallback, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import StartupPage from '../../pages/StartupPage'
import { ConnectionContext } from '../../context/ConnectionContext'
import { StorageStatsContext } from '../../context/StorageStatsContext'
import AttachmentService from '../../services/AttachmentService'

export default function ConnectionGuard() {
  const [status, setStatus] = useState('CONNECTING')
  const [storageStats, setStorageStats] = useState(null)

  const refreshStorageStats = useCallback(async () => {
    try {
      const stats = await AttachmentService.getStorageStats()
      setStorageStats(stats)
      return stats
    } catch (err) {
      console.error('Failed to refresh storage statistics:', err)
      return null
    }
  }, [])

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

  // Load storage stats when database successfully connects
  useEffect(() => {
    if (status === 'CONNECTED') {
      let active = true
      Promise.resolve().then(() => {
        if (active) {
          refreshStorageStats()
        }
      })
      return () => {
        active = false
      }
    }
    return undefined
  }, [status, refreshStorageStats])

  const storagePercentage = useMemo(() => {
    if (!storageStats || !storageStats.limit) return 0
    return (storageStats.totalSize / storageStats.limit) * 100
  }, [storageStats])

  if (status === 'CONNECTED') {
    return (
      <ConnectionContext.Provider value={status}>
        <StorageStatsContext.Provider
          value={{ storageStats, storagePercentage, refreshStorageStats }}
        >
          <Outlet />
        </StorageStatsContext.Provider>
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
