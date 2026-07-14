import { Paperclip, Trash2, Upload, AlertCircle } from 'lucide-react'

/**
 * Reusable Attachment Input widget with built-in validation.
 */
export default function FormAttachmentInput({
  requirementKey,
  label = 'Lampiran Pendukung',
  attachments = [],
  onAttach,
  onRemove,
  disabled = false,
  storageStats = null
}) {
  // Filter attachments for this specific requirement
  const itemAttachments = attachments.filter((a) => a.requirementKey === requirementKey)

  // Enforce global storage limits checking (98% threshold blocking)
  const isStorageBlocked =
    storageStats && storageStats.limit && storageStats.totalSize / storageStats.limit >= 0.98

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    // 1. Extension / MIME Type Whitelist
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    if (!allowedExtensions.includes(fileExt)) {
      alert('Format file tidak didukung. File harus berupa PDF, JPEG, PNG, DOC, atau DOCX.')
      e.target.value = ''
      return
    }

    // 2. Individual file size limit: 10 MB
    const maxFileSize = 10 * 1024 * 1024
    if (file.size > maxFileSize) {
      alert('File terlalu besar! Ukuran file maksimal adalah 10 MB.')
      e.target.value = ''
      return
    }

    // 3. Max files per media record: 10
    if (attachments.length >= 10) {
      alert('Jumlah file maksimal untuk media ini adalah 10 file.')
      e.target.value = ''
      return
    }

    // 4. Cumulative size limit: 30 MB
    const currentTotalSize = attachments.reduce((acc, a) => acc + a.size, 0)
    if (currentTotalSize + file.size > 30 * 1024 * 1024) {
      alert('Total ukuran seluruh file media ini maksimal adalah 30 MB.')
      e.target.value = ''
      return
    }

    // Trigger the callback
    onAttach(requirementKey, file)
    e.target.value = '' // Clear input
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-600">
            <Paperclip size={13} className="text-slate-400" />
            {label}
          </span>
          <span className="text-[10px] text-slate-400">
            {itemAttachments.length > 0 ? `${itemAttachments.length} file` : 'Opsional'}
          </span>
        </div>

        {/* Existing files list */}
        {itemAttachments.length > 0 && (
          <div className="space-y-1.5">
            {itemAttachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 text-xs shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Paperclip size={12} className="text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700 truncate" title={file.originalName}>
                    {file.originalName}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  {file.isQueued && (
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">
                      Antrean
                    </span>
                  )}
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(file.id)}
                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-md transition shrink-0"
                    title="Hapus lampiran"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload box */}
        {!disabled && (
          <div>
            {isStorageBlocked ? (
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 rounded-lg py-2 px-3 text-[11px] font-medium leading-relaxed">
                <AlertCircle size={13} className="shrink-0 text-red-500" />
                <span>Penyimpanan penuh. Pengunggahan dinonaktifkan.</span>
              </div>
            ) : (
              <label className="flex items-center justify-center border border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg py-2 px-3 text-xs text-slate-500 hover:text-blue-600 cursor-pointer transition shadow-sm bg-slate-50/50">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/jpeg,image/png,.doc,.docx"
                  onChange={handleFileChange}
                />
                <Upload size={13} className="mr-1.5 shrink-0" />
                Unggah Dokumen
              </label>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
