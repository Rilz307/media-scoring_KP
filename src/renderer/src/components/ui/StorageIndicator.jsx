import { useContext } from 'react'
import { Database } from 'lucide-react'
import { StorageStatsContext } from '../../context/StorageStatsContext'

export default function StorageIndicator() {
  const { storageStats, storagePercentage } = useContext(StorageStatsContext)

  if (!storageStats) {
    return null
  }

  const usedMB = (storageStats.totalSize / (1024 * 1024)).toFixed(1)
  const limitMB = (storageStats.limit / (1024 * 1024)).toFixed(0)
  const percentageStr = (storagePercentage || 0).toFixed(1)

  // Color coding based on usage percentage
  let progressColor = 'bg-blue-500'
  if (storagePercentage >= 95) {
    progressColor = 'bg-red-500'
  } else if (storagePercentage >= 80) {
    progressColor = 'bg-amber-500'
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Database size={12} />
          Penyimpanan Lampiran
        </span>
        <div className="text-[10px] font-bold text-slate-400">{percentageStr}%</div>
      </div>

      <div className="text-xl font-bold text-slate-900 mt-2">
        {usedMB} <span className="text-sm font-medium text-slate-400">/ {limitMB} MB</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-2">
        <div
          className={`h-full rounded-full ${progressColor} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, storagePercentage || 0)}%` }}
        />
      </div>
    </div>
  )
}
