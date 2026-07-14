import { Download, X, ExternalLink } from 'lucide-react'

export default function AttachmentViewerModal({
  isOpen,
  onClose,
  fileType, // 'image' | 'pdf'
  blobUrl,
  filename,
  onDownload,
  onNativeOpen
}) {
  if (!isOpen || !blobUrl) return null

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 shadow-md border-b border-slate-800">
        <div>
          <h2 className="text-white font-bold text-lg">Pratinjau Lampiran</h2>
          <p className="text-slate-400 text-xs font-medium mt-0.5">{filename}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNativeOpen}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <ExternalLink size={16} />
            Buka
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Download size={16} />
            Unduh
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <X size={16} />
            Tutup
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 w-full h-full bg-slate-800 p-4 md:p-8 overflow-hidden flex justify-center items-center">
        {fileType === 'pdf' ? (
          <embed
            src={`${blobUrl}#view=FitH`}
            type="application/pdf"
            className="w-full max-w-5xl aspect-[1/1.414] max-h-full bg-white shadow-2xl rounded"
          />
        ) : (
          <img
            src={blobUrl}
            alt={filename}
            className="max-w-full max-h-full object-contain rounded shadow-2xl"
          />
        )}
      </div>
    </div>
  )
}
