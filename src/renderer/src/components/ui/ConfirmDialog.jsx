import { AlertTriangle } from 'lucide-react'

/**
 * Reusable modal confirm dialog component.
 */
function ConfirmDialog({
  isOpen,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmText = 'Hapus',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-100 overflow-hidden"
        role="dialog"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-red-50 p-2.5 rounded-full text-red-500 border border-red-100 flex-shrink-0">
              <AlertTriangle size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-slate-900 font-bold text-lg">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Menghapus...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
