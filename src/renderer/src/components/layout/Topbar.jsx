import { NavLink } from 'react-router-dom'
import { Award, Database, Server, Clock, LogOut, RefreshCw } from 'lucide-react'
import { useConnection } from '../../context/ConnectionContext'
import { useState, useEffect, useRef } from 'react'
import { useStorageStats } from '../../context/StorageStatsContext'

function Topbar() {
  const connectionStatus = useConnection()
  const [showPopover, setShowPopover] = useState(false)
  const popoverRef = useRef(null)
  const { storageStats, loading: statsLoading, refreshStorageStats } = useStorageStats()

  // Refresh stats on popover open if database is connected
  useEffect(() => {
    if (showPopover && connectionStatus === 'CONNECTED') {
      refreshStorageStats()
    }
  }, [showPopover, connectionStatus, refreshStorageStats])

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'CONNECTED':
        return 'text-green-500'
      case 'CONNECTING':
        return 'text-orange-500 animate-pulse'
      default:
        return 'text-red-500'
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'CONNECTED':
        return 'Connected'
      case 'CONNECTING':
        return 'Connecting...'
      default:
        return 'Disconnected'
    }
  }

  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-8 shadow-sm relative">
      {/* Left: Branding & Info */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Award size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight">Media Scoring System</h1>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Dinas Kominfo Kota Kendari
          </p>
        </div>
      </div>

      {/* Right: Navigation Links & Status */}
      <nav className="flex items-center gap-6">
        {/* Clickable Status Badge */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setShowPopover(!showPopover)}
            className="flex items-center gap-2 text-xs font-semibold bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <Database size={14} className={getStatusColor()} />
            <span className="text-slate-300">{getStatusText()}</span>
          </button>

          {/* Popover Menu */}
          {showPopover && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 text-slate-800">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Database size={18} className={getStatusColor()} />
                  <span className="font-bold">{getStatusText()}</span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Server size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-700">Cluster Aktif:</span>
                      <p className="font-mono text-slate-500 break-all">
                        {connectionStatus === 'CONNECTED'
                          ? '(Didapatkan via Config/Metadada)'
                          : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="shrink-0 text-slate-400" />
                    <span className="font-semibold text-slate-700">Waktu Koneksi:</span>
                    <span className="text-slate-500">Saat ini</span>
                  </div>
                </div>
              </div>

              {/* Attachment Storage Capacity (GridFS) */}
              {connectionStatus === 'CONNECTED' && (
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Penyimpanan Lampiran
                  </span>
                  {statsLoading && !storageStats ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Memuat kapasitas...</span>
                    </div>
                  ) : storageStats ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{storageStats.totalFiles} Berkas Diunggah</span>
                        <span>
                          {formatBytes(storageStats.totalSize)} / {formatBytes(storageStats.limit)}
                        </span>
                      </div>
                      {/* Capacity progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            getStoragePercentage(storageStats) >= 90
                              ? 'bg-rose-500'
                              : getStoragePercentage(storageStats) >= 70
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${Math.min(100, getStoragePercentage(storageStats))}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Batas Kuota Atlas Free</span>
                        <span className="font-bold">
                          {getStoragePercentage(storageStats).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Gagal memuat status</span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="bg-slate-50 p-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setShowPopover(false)
                    window.api.db.disconnect()
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 font-medium rounded-lg hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all text-left"
                >
                  <LogOut size={16} />
                  Disconnect
                </button>
                <button
                  onClick={() => {
                    setShowPopover(false)
                    window.api.db.forgetConfig()
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 font-medium rounded-lg hover:bg-white hover:shadow-sm transition-all text-left"
                >
                  <RefreshCw size={16} />
                  Lupakan Konfigurasi
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-700 mx-2"></div>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 text-sm font-semibold rounded-lg transition ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </header>
  )
}

function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

function getStoragePercentage(stats) {
  if (!stats || !stats.limit) return 0
  return (stats.totalSize / stats.limit) * 100
}

export default Topbar
