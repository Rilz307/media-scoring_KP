import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import MediaService from '../services/MediaService'
import MediaForm from '../components/form/MediaForm'
import { useStorageStats } from '../context/StorageStatsContext'
import StorageIndicator from '../components/ui/StorageIndicator'

export default function MediaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [initialData, setInitialData] = useState(null)
  const [pageLoading, setPageLoading] = useState(isEdit)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState(null)
  const { storageStats, storagePercentage, refreshStorageStats } = useStorageStats()

  const loadMedia = useCallback(async () => {
    try {
      setPageLoading(true)
      setError(null)
      const data = await MediaService.getById(id)
      if (!data) {
        throw new Error('Data media tidak ditemukan di database.')
      }
      setInitialData(data)
    } catch (err) {
      setError(err.message || 'Gagal memuat data media.')
    } finally {
      setPageLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isEdit) {
      let active = true
      Promise.resolve().then(() => {
        if (active) {
          loadMedia()
        }
      })
      return () => {
        active = false
      }
    }
    return undefined
  }, [isEdit, loadMedia])

  const fileToUint8Array = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(new Uint8Array(e.target.result))
      reader.onerror = reject
      reader.readAsArrayBuffer(file)
    })

  const handleSave = async (formData) => {
    const uploadedFileIds = []
    try {
      setSaveLoading(true)
      setError(null)

      const finalAttachments = []
      const queuedUploads = []

      // 1. Separate existing attachments from new queued uploads
      if (formData.attachments && Array.isArray(formData.attachments)) {
        for (const item of formData.attachments) {
          if (item.isQueued) {
            queuedUploads.push(item)
          } else {
            finalAttachments.push(item)
          }
        }
      }

      // 2. Process queued uploads sequentially
      for (const item of queuedUploads) {
        const fileExt = item.originalName
          .substring(item.originalName.lastIndexOf('.'))
          .toLowerCase()

        // --- MIME Type + Extension paired validation (defense-in-depth) ---
        // Browsers may omit MIME for DOC/DOCX; application/octet-stream is a
        // legitimate fallback for those formats. All other extensions require
        // an explicit matching MIME type to prevent renamed-extension attacks.
        const ALLOWED_EXT_MIME = {
          '.pdf': ['application/pdf'],
          '.jpg': ['image/jpeg'],
          '.jpeg': ['image/jpeg'],
          '.png': ['image/png'],
          '.doc': ['application/msword', 'application/octet-stream'],
          '.docx': [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/octet-stream'
          ]
        }
        const allowedMimes = ALLOWED_EXT_MIME[fileExt]
        if (!allowedMimes) {
          throw new Error(`Ekstensi file tidak diizinkan: ${item.originalName}`)
        }
        if (!allowedMimes.includes(item.mimeType)) {
          throw new Error(
            `Tipe MIME tidak sesuai untuk file: ${item.originalName} (diterima: ${item.mimeType})`
          )
        }
        // --- End MIME validation ---

        let uploadPayload
        const isImage = ['.jpg', '.jpeg', '.png'].includes(fileExt)

        if (isImage) {
          // Compress image client-side before upload
          try {
            const { compressImageToBuffer } = await import('../utils/imageCompressor')
            uploadPayload = await compressImageToBuffer(item.localFile)
          } catch (compressErr) {
            console.error(
              'Image compression failed, falling back to FileReader buffer:',
              compressErr
            )
            uploadPayload = await fileToUint8Array(item.localFile)
          }
        } else {
          // Standard files (PDF, DOC, DOCX) — read via FileReader, no File.path dependency
          uploadPayload = await fileToUint8Array(item.localFile)
        }

        // --- Empty file guard ---
        if (!uploadPayload || uploadPayload.byteLength === 0) {
          throw new Error(`File lampiran kosong (0 byte): ${item.originalName}`)
        }
        // --- End empty file guard ---

        // Upload to GridFS via IPC
        const uploadResult = await window.api.attachments.upload(
          uploadPayload,
          item.originalName,
          item.mimeType
        )

        if (!uploadResult || !uploadResult.fileId) {
          throw new Error(`Gagal mengunggah berkas: ${item.originalName}`)
        }

        // Keep track of uploaded fileIds for potential rollback
        uploadedFileIds.push(uploadResult.fileId)

        // Add to final attachments list
        finalAttachments.push({
          id: item.id,
          provider: 'gridfs',
          fileId: uploadResult.fileId,
          originalName: uploadResult.originalName,
          mimeType: uploadResult.mimeType,
          size: uploadResult.size,
          uploadedAt: new Date().toISOString(),
          requirementKey: item.requirementKey
        })
      }

      // Construct clean form payload for MongoDB save
      const savePayload = {
        nama_media: formData.nama_media,
        perusahaan: formData.perusahaan,
        jenis: formData.jenis,
        alamat: formData.alamat,
        telepon: formData.telepon,
        email: formData.email,
        website: formData.website,
        answers: formData.answers,
        totalScore: formData.totalScore,
        grade: formData.grade,
        criteriaVersion: formData.criteriaVersion,
        attachments: finalAttachments
      }

      // 3. Save to MongoDB
      if (isEdit) {
        await MediaService.update(id, savePayload)

        // Check for removed attachments (files that were in initialData but are no longer in finalAttachments)
        const initialAttachments = initialData?.attachments || []
        const finalFileIds = finalAttachments.map((f) => f.fileId)
        for (const oldAtt of initialAttachments) {
          if (!finalFileIds.includes(oldAtt.fileId)) {
            // Delete removed attachment from GridFS
            try {
              await window.api.attachments.delete(oldAtt.fileId)
            } catch (delErr) {
              console.error(`Failed to delete removed attachment ${oldAtt.fileId}:`, delErr.message)
            }
          }
        }

        refreshStorageStats()
        navigate('/', { state: { message: 'Media berhasil diperbarui' } })
      } else {
        await MediaService.create(savePayload)
        refreshStorageStats()
        navigate('/', { state: { message: 'Media berhasil ditambahkan' } })
      }
    } catch (err) {
      console.error('Error during transactional save:', err)

      // Rollback: Delete successfully uploaded files from GridFS
      if (uploadedFileIds.length > 0) {
        console.warn(
          'Rolling back uploaded attachments due to transaction failure:',
          uploadedFileIds
        )
        for (const fileId of uploadedFileIds) {
          try {
            await window.api.attachments.delete(fileId)
          } catch (rollbackErr) {
            console.error(`Rollback failed for file ${fileId}:`, rollbackErr.message)
          }
        }
      }

      setError(err.message || 'Gagal menyimpan data media.')
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <button
          onClick={() => navigate('/')}
          className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isEdit ? 'Edit Data Media' : 'Tambah Media Baru'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEdit
              ? 'Perbarui detail data administrasi media kerja sama.'
              : 'Daftarkan media baru ke dalam sistem skoring.'}
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && !pageLoading && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-sm">Terjadi Kesalahan</span>
            <p className="text-xs text-red-600/90 leading-relaxed">{error}</p>
            {isEdit && !initialData && (
              <button
                onClick={loadMedia}
                className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition block underline"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      )}

      {/* Storage Capacity Warning Banners */}
      {storageStats && storagePercentage >= 70 && (
        <div
          className={`border rounded-xl p-4 flex items-start gap-3 shadow-sm ${
            storagePercentage >= 90
              ? 'bg-red-50 border-red-100 text-red-800'
              : 'bg-amber-50 border-amber-100 text-amber-800'
          }`}
        >
          <AlertTriangle
            size={20}
            className={`flex-shrink-0 mt-0.5 ${
              storagePercentage >= 90 ? 'text-red-600' : 'text-amber-600'
            }`}
          />
          <div className="space-y-1">
            <p className="text-xs font-semibold leading-relaxed">
              {storagePercentage >= 98
                ? 'Penyimpanan lampiran penuh. Pengunggahan file baru sementara dinonaktifkan.'
                : storagePercentage >= 90
                  ? `Penyimpanan lampiran hampir penuh (${storagePercentage.toFixed(1)}% terpakai).`
                  : `Penyimpanan lampiran telah digunakan sebesar ${storagePercentage.toFixed(1)}%.`}
            </p>
          </div>
        </div>
      )}

      {storageStats && (
        <div className="max-w-md">
          <StorageIndicator />
        </div>
      )}

      {/* Form or Loader */}
      {pageLoading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <span className="text-slate-500 font-medium text-sm">Memuat data media...</span>
        </div>
      ) : (
        (!isEdit || initialData) && (
          <MediaForm
            initialData={initialData}
            onSave={handleSave}
            onCancel={() => navigate('/')}
            loading={saveLoading}
            storageStats={storageStats}
          />
        )
      )}
    </div>
  )
}
