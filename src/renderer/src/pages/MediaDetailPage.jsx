import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit,
  AlertTriangle,
  Calendar,
  Award,
  Globe,
  Mail,
  Phone,
  MapPin,
  Download,
  FileText,
  Eye,
  ExternalLink
} from 'lucide-react'
import MediaService from '../services/MediaService'
import mediaCriteria from '../constants/mediaCriteria'
import gradeRules from '../constants/gradeRules'
import normalizeReport from '../utils/ReportBuilder'
import PdfPreviewModal from '../components/ui/PdfPreviewModal'
import PdfExportService from '../pdf/services/PdfExportService'
import AttachmentService from '../services/AttachmentService'
import AttachmentViewerModal from '../components/ui/AttachmentViewerModal'

export default function MediaDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [media, setMedia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exporting, setExporting] = useState(false)
  const [previewData, setPreviewData] = useState({ isOpen: false, blobUrl: null, filename: '' })

  const [attachmentPreview, setAttachmentPreview] = useState({
    isOpen: false,
    fileType: null,
    blobUrl: null,
    filename: '',
    att: null
  })
  const [loadingActions, setLoadingActions] = useState(new Set())

  const addLoadingKey = useCallback((key) => {
    setLoadingActions((prev) => {
      console.log('[Attachment] loadingActions BEFORE ADD:', [...prev])
      const next = new Set([...prev, key])
      console.log('[Attachment] loadingActions AFTER ADD:', [...next])
      return next
    })
  }, [])

  const removeLoadingKey = useCallback((key) => {
    setLoadingActions((prev) => {
      console.log('[Attachment] loadingActions BEFORE REMOVE:', [...prev])
      const next = new Set(prev)
      next.delete(key)
      console.log('[Attachment] loadingActions AFTER REMOVE:', [...next])
      return next
    })
  }, [])

  // Defensive cleanup: reset all loading states on unmount
  useEffect(() => {
    return () => {
      console.log('[Attachment] Component unmounting')
      setLoadingActions(new Set())
    }
  }, [])

  const report = useMemo(() => {
    if (!media) return null
    return normalizeReport(media, mediaCriteria)
  }, [media])

  const loadMedia = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MediaService.getById(id)
      if (!data) {
        throw new Error('Data media tidak ditemukan.')
      }
      setMedia(data)
    } catch (err) {
      setError(err.message || 'Gagal memuat detail data media.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (active) {
        loadMedia()
      }
    })
    return () => {
      active = false
    }
  }, [loadMedia])

  const formatTimestampID = (isoString) => {
    if (!isoString) return '-'
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return '-'
      const day = date.getDate()
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember'
      ]
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${day} ${month} ${year} ${hours}:${minutes} WITA`
    } catch {
      return '-'
    }
  }

  const handleExportPDF = async () => {
    if (!media) return
    try {
      setExporting(true)
      setError(null)
      // Allow UI to update to loading state briefly
      await new Promise((resolve) => setTimeout(resolve, 50))

      const preview = await PdfExportService.previewMediaReport(media)
      setPreviewData({
        isOpen: true,
        blobUrl: preview.blobUrl,
        isHtml: preview.isHtml,
        htmlContent: preview.htmlContent,
        filename: preview.filename
      })
    } catch (err) {
      setError(`Gagal menyiapkan preview PDF: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  const handlePreviewAttachment = async (att) => {
    // --- Schema audit & fileId guard ---
    const fileId = att.fileId ?? att.identifier ?? att.gridFsId ?? null
    if (!fileId) {
      console.warn('[Attachment] Legacy/invalid schema detected', att)
      alert(`Attachment "${att.originalName}" tidak memiliki fileId yang valid.`)
      return
    }
    if (fileId !== att.fileId) {
      console.warn('[Attachment] Legacy attachment schema detected', att)
    }
    const key = `preview-${fileId}`
    console.log('[Attachment Action]', { action: 'preview', fileId, key })
    try {
      addLoadingKey(key)
      const buffer = await AttachmentService.getBuffer(fileId)
      const blob = new Blob([buffer], { type: att.mimeType })
      const url = URL.createObjectURL(blob)

      console.log('[Attachment] Opening preview modal for', fileId)
      setAttachmentPreview({
        isOpen: true,
        fileType: att.mimeType === 'application/pdf' ? 'pdf' : 'image',
        blobUrl: url,
        filename: att.originalName,
        att: { ...att, fileId } // normalise fileId in stored att
      })
    } catch (err) {
      console.error('[Attachment] Exception in Preview:', err)
      alert(`Gagal memuat pratinjau: ${err.message}`)
    } finally {
      console.log('[Attachment] Preview finally block running for', fileId)
      removeLoadingKey(key)
    }
  }

  const handleNativeOpen = async (att) => {
    // --- Schema audit & fileId guard ---
    const fileId = att.fileId ?? att.identifier ?? att.gridFsId ?? null
    if (!fileId) {
      console.warn('[Attachment] Legacy/invalid schema detected', att)
      alert(`Attachment "${att.originalName}" tidak memiliki fileId yang valid.`)
      return
    }
    if (fileId !== att.fileId) {
      console.warn('[Attachment] Legacy attachment schema detected', att)
    }
    const key = `open-${fileId}`
    console.log('[Attachment Action]', { action: 'open', fileId, key })
    try {
      addLoadingKey(key)
      await AttachmentService.openNative(fileId, att.originalName)
    } catch (err) {
      console.error('[Attachment] Exception in Open:', err)
      alert(`Gagal membuka file: ${err.message}`)
    } finally {
      console.log('[Attachment] Open finally block running for', fileId)
      removeLoadingKey(key)
    }
  }

  const handleDownloadAttachment = async (att) => {
    // --- Schema audit & fileId guard ---
    const fileId = att.fileId ?? att.identifier ?? att.gridFsId ?? null
    if (!fileId) {
      console.warn('[Attachment] Legacy/invalid schema detected', att)
      alert(`Attachment "${att.originalName}" tidak memiliki fileId yang valid.`)
      return
    }
    if (fileId !== att.fileId) {
      console.warn('[Attachment] Legacy attachment schema detected', att)
    }
    const key = `download-${fileId}`
    console.log('[Attachment Action]', { action: 'download', fileId, key })
    try {
      addLoadingKey(key)
      await AttachmentService.download(fileId, att.originalName)
    } catch (err) {
      console.error('[Attachment] Exception in Download:', err)
      alert(`Gagal mengunduh file: ${err.message}`)
    } finally {
      console.log('[Attachment] Download finally block running for', fileId)
      removeLoadingKey(key)
    }
  }

  const renderAttachments = () => {
    if (!media.attachments || media.attachments.length === 0) {
      return (
        <div className="text-sm text-slate-400 italic py-2">
          Tidak ada dokumen pendukung yang dilampirkan.
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {media.attachments.map((att) => {
          // --- Runtime schema audit ---
          console.log('[Attachment]', {
            id: att.id,
            fileId: att.fileId,
            originalName: att.originalName,
            mimeType: att.mimeType,
            size: att.size
          })
          if (!att.fileId) {
            console.warn('[Attachment] fileId is missing for attachment:', att)
          }

          const resolvedFileId = att.fileId ?? att.identifier ?? att.gridFsId ?? null

          return (
            <div
              key={att.id}
              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="bg-blue-100 p-2 rounded text-blue-600 flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold text-slate-800 truncate"
                    title={att.originalName}
                  >
                    {att.originalName}
                  </p>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-bold bg-slate-200/50 px-1.5 py-0.5 rounded">
                      {att.requirementKey || 'UMUM'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handlePreviewAttachment(att)}
                  disabled={!resolvedFileId || loadingActions.has(`preview-${resolvedFileId}`)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                  title={resolvedFileId ? 'Preview' : 'File ID tidak tersedia'}
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleNativeOpen(att)}
                  disabled={!resolvedFileId || loadingActions.has(`open-${resolvedFileId}`)}
                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                  title={resolvedFileId ? 'Buka Eksternal' : 'File ID tidak tersedia'}
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={() => handleDownloadAttachment(att)}
                  disabled={!resolvedFileId || loadingActions.has(`download-${resolvedFileId}`)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50"
                  title={resolvedFileId ? 'Unduh' : 'File ID tidak tersedia'}
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderAssessmentDetails = () => {
    if (!report || !report.sections || report.sections.length === 0) {
      return (
        <p className="text-sm text-slate-400 italic">
          Kriteria penilaian untuk jenis media <strong>{media?.jenis}</strong> belum dikonfigurasi.
        </p>
      )
    }

    return (
      <div className="space-y-6">
        {report.sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                {section.title}
              </h4>
              <span className="text-xs font-bold text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded">
                Subtotal: {section.subtotal} Poin
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {section.questions.map((question) => (
                <div
                  key={question.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                      {question.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {question.answerLabel}
                    </span>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                      {question.points} Poin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Detail Media</h1>
            <p className="text-sm text-slate-500 mt-1">
              Informasi lengkap data administrasi media.
            </p>
          </div>
        </div>

        {!loading && !error && report && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition shadow-sm font-semibold text-sm ${
                exporting
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Download size={16} />
              {exporting ? 'Memproses...' : 'Export PDF'}
            </button>
            <button
              onClick={() => navigate(`/media/${id}/edit`)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white transition shadow-sm font-semibold text-sm"
            >
              <Edit size={16} />
              Edit Media
            </button>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center max-w-md mx-auto space-y-4">
          <div className="bg-red-100 p-3 rounded-full text-red-600 border border-red-200 inline-block">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-lg">Gagal Memuat Detail</h3>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={loadMedia}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white transition font-semibold text-xs shadow-sm"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <span className="text-slate-500 font-medium text-sm">Memuat detail media...</span>
        </div>
      )}

      {/* Details Card */}
      {!loading && !error && report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{report.nama_media}</h2>
                <p className="text-sm text-slate-500 font-medium">
                  {report.perusahaan || 'Perusahaan tidak terdaftar'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div className="flex gap-3">
                  <Mail className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Email
                    </span>
                    <span className="text-sm text-slate-800 font-semibold">
                      {report.email || '-'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Telepon
                    </span>
                    <span className="text-sm text-slate-800 font-semibold">
                      {report.telepon || '-'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Globe className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Website
                    </span>
                    {report.website ? (
                      <a
                        href={
                          report.website.startsWith('http')
                            ? report.website
                            : `https://${report.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline font-semibold block"
                      >
                        {report.website}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-800 font-semibold">-</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <MapPin className="text-slate-400 mt-0.5" size={18} />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Alamat Kantor
                    </span>
                    <span className="text-sm text-slate-800 font-medium leading-relaxed block">
                      {report.alamat || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                Dokumen Pendukung
              </h3>
              {renderAttachments()}
            </div>

            {/* Assessment Details Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                Hasil Evaluasi Kriteria Penilaian
              </h3>
              {renderAssessmentDetails()}
            </div>
          </div>

          {/* Assessment & Metadata Card */}
          <div className="space-y-6">
            {/* Score & Grade Summary */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-4">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600 border border-blue-100">
                <Award size={32} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hasil Penilaian
                </span>
                <div className="text-4xl font-black text-slate-900 mt-1">{report.totalScore}</div>
                <div className="text-xs text-slate-500 mt-0.5">Total Skor Penilaian</div>
              </div>

              <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status Grade
                </span>
                {gradeRules.enabled ? (
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-bold border ${
                      ['Tinggat I', 'Tingkat I'].includes(report.grade)
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : [
                              'Tinggat II',
                              'Tingkat II',
                              'Tinggatil',
                              'Tingkat III',
                              'TingkaT III'
                            ].includes(report.grade)
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    Grade {report.grade || '-'}
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 italic">
                    Belum dikonfigurasi
                  </span>
                )}
              </div>

              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Jenis Media
                </span>
                <span className="text-sm font-bold text-slate-800">{report.jenis}</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex gap-3">
                <Calendar className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Didaftarkan Pada
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {formatTimestampID(report.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <Calendar className="text-slate-400 mt-0.5" size={18} />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Terakhir Diperbarui
                  </span>
                  <span className="text-xs text-slate-700 font-semibold">
                    {formatTimestampID(report.updatedAt || report.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={previewData.isOpen}
        blobUrl={previewData.blobUrl}
        isHtml={previewData.isHtml}
        htmlContent={previewData.htmlContent}
        filename={previewData.filename}
        onClose={() => {
          if (previewData.blobUrl) URL.revokeObjectURL(previewData.blobUrl)
          setPreviewData({
            isOpen: false,
            blobUrl: null,
            isHtml: false,
            htmlContent: null,
            filename: ''
          })
        }}
        onDownload={async () => {
          try {
            setExporting(true)
            await PdfExportService.downloadMediaReport(media)
          } catch (err) {
            setError(`Gagal mengunduh PDF: ${err.message}`)
          } finally {
            setExporting(false)
          }
        }}
      />

      {/* Attachment Preview Modal */}
      <AttachmentViewerModal
        isOpen={attachmentPreview.isOpen}
        fileType={attachmentPreview.fileType}
        blobUrl={attachmentPreview.blobUrl}
        filename={attachmentPreview.filename}
        onClose={() => {
          console.log('[Attachment] Closing preview modal')
          // Capture blobUrl before state update, revoke AFTER state update
          // to avoid race condition where modal DOM persists with revoked URL
          const urlToRevoke = attachmentPreview.blobUrl
          setAttachmentPreview({
            isOpen: false,
            fileType: null,
            blobUrl: null,
            filename: '',
            att: null
          })
          // Defer revocation to next microtask so React can unmount the embed/img first
          if (urlToRevoke) setTimeout(() => URL.revokeObjectURL(urlToRevoke), 0)
        }}
        onDownload={() => handleDownloadAttachment(attachmentPreview.att)}
        onNativeOpen={() => handleNativeOpen(attachmentPreview.att)}
      />
    </div>
  )
}
