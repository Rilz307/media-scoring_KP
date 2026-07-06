import { Download, X } from 'lucide-react'

export default function PdfPreviewModal({
  isOpen,
  onClose,
  blobUrl,
  isHtml,
  htmlContent,
  filename,
  onDownload
}) {
  if (!isOpen || (!blobUrl && !isHtml)) return null

  const handleDownload = () => {
    onDownload(filename)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 shadow-md border-b border-slate-800">
        <div>
          <h2 className="text-white font-bold text-lg">Pratinjau Dokumen</h2>
          <p className="text-slate-400 text-xs font-medium mt-0.5">{filename}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
          >
            <X size={16} />
            Tutup Preview
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 w-full h-full bg-slate-800 p-4 md:p-8 overflow-hidden flex justify-center items-start">
        {isHtml ? (
          <iframe
            srcDoc={htmlContent}
            className="w-full max-w-4xl aspect-[1/1.414] max-h-full bg-white shadow-2xl rounded"
            title="PDF Preview"
            style={{ border: 'none' }}
          />
        ) : (
          <embed
            src={`${blobUrl}#view=FitH`}
            type="application/pdf"
            className="w-full max-w-4xl aspect-[1/1.414] max-h-full bg-white shadow-2xl rounded"
          />
        )}
      </div>
    </div>
  )
}
