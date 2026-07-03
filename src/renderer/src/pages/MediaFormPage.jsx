import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import MediaService from '../services/MediaService'
import MediaForm from '../components/form/MediaForm'

export default function MediaFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [initialData, setInitialData] = useState(null)
  const [pageLoading, setPageLoading] = useState(isEdit)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const handleSave = async (formData) => {
    try {
      setSaveLoading(true)
      setError(null)
      if (isEdit) {
        await MediaService.update(id, formData)
        navigate('/', { state: { message: 'Media berhasil diperbarui' } })
      } else {
        await MediaService.create(formData)
        navigate('/', { state: { message: 'Media berhasil ditambahkan' } })
      }
    } catch (err) {
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
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
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
          />
        )
      )}
    </div>
  )
}
