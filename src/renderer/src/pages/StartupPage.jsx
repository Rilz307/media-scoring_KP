import { useState } from 'react'
import { Database, Loader2 } from 'lucide-react'
import ConnectionManager from '../components/startup/ConnectionManager'

export default function StartupPage({ status = 'CONNECTING' }) {
  const [isRetrying, setIsRetrying] = useState(false)

  const handleSaveConnect = async (uri) => {
    setIsRetrying(true)

    try {
      await window.api.db.saveConfig(uri)
    } catch (err) {
      console.error(err)
    } finally {
      setIsRetrying(false)
    }
  }

  // Display status based directly on props and transient retry state
  const currentStatus = isRetrying ? 'CONNECTING' : status

  if (
    currentStatus === 'NOT_CONFIGURED' ||
    currentStatus === 'FAILED' ||
    currentStatus === 'DISCONNECTED'
  ) {
    return <ConnectionManager onSaveConnect={handleSaveConnect} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
        {/* Visual Icon Section */}
        <div className="flex justify-center">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border border-blue-100 text-blue-600">
            <Database size={36} className="animate-pulse" />
            <Loader2 size={20} className="absolute bottom-1 right-1 animate-spin text-blue-500" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Menghubungkan ke Database</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sistem sedang memverifikasi koneksi dengan klaster database Dinas Kominfo Kota
            Kendari...
          </p>
        </div>

        {/* Action Button & Loader Indicator */}
        <div className="pt-2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              Menghubungkan...
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
