import { useState, useEffect } from 'react'
import {
  Database,
  Link,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings
} from 'lucide-react'
import Button from '../ui/Button'
import { translateMongoError } from '../../utils/MongoErrorTranslator'

export default function ConnectionManager({ onSaveConnect }) {
  const [uri, setUri] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null) // { success: boolean, translated: { title, description, original } }
  const [isSaving, setIsSaving] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showTechDetails, setShowTechDetails] = useState(false)
  const [appStatus, setAppStatus] = useState('NOT_CONFIGURED') // NOT_CONFIGURED, CONNECTING, CONNECTED, FAILED

  // Fetch initial config if it exists
  useEffect(() => {
    async function fetchConfig() {
      try {
        const config = await window.api.db.getConfig()
        if (config.success && config.uri) {
          setUri(config.uri)
          setAppStatus('FAILED') // If it has URI but we are here, it likely failed previously
        } else {
          setAppStatus('NOT_CONFIGURED')
        }
      } catch (err) {
        console.error('Failed to load initial config:', err)
        setAppStatus('NOT_CONFIGURED')
      }
    }
    fetchConfig()
  }, [])

  const validateUri = (testUri) => {
    if (!testUri || testUri.trim() === '') return false
    return testUri.startsWith('mongodb://') || testUri.startsWith('mongodb+srv://')
  }

  const handleTestConnection = async () => {
    if (!validateUri(uri)) {
      setTestResult({
        success: false,
        translated: {
          title: 'Format Tidak Valid',
          description: 'URL Koneksi harus diawali dengan "mongodb://" atau "mongodb+srv://".',
          original: 'Invalid URI Format'
        }
      })
      setAppStatus('FAILED')
      return
    }

    setIsTesting(true)
    setTestResult(null)
    setAppStatus('CONNECTING')
    setShowTechDetails(false)

    try {
      const res = await window.api.db.testConnection(uri)
      if (res.success) {
        setTestResult({
          success: true,
          metadata: res.metadata,
          translated: {
            title: 'Koneksi Berhasil!',
            description: `Sistem berhasil terhubung ke server database.`,
            original: null
          }
        })
        setAppStatus('CONNECTED')
      } else {
        const translated = translateMongoError(res.error)
        setTestResult({
          success: false,
          translated
        })
        setAppStatus(translated.errorType || 'FAILED')
      }
    } catch (error) {
      console.error('Test connection error:', error)
      const translated = translateMongoError(error)
      setTestResult({
        success: false,
        translated
      })
      setAppStatus(translated.errorType || 'FAILED')
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = async () => {
    if (!validateUri(uri)) {
      setTestResult({
        success: false,
        translated: {
          title: 'Format Tidak Valid',
          description: 'URL Koneksi harus diawali dengan "mongodb://" atau "mongodb+srv://".',
          original: 'Invalid URI Format'
        }
      })
      setAppStatus('INVALID_FORMAT')
      return
    }

    setIsSaving(true)
    setAppStatus('CONNECTING')

    if (onSaveConnect) {
      await onSaveConnect(uri)
    }

    setIsSaving(false)
  }

  const openAtlas = () => {
    window.api.system.openExternal('https://cloud.mongodb.com/')
  }

  const renderStatusHeader = () => {
    const statusMap = {
      NOT_CONFIGURED: {
        icon: <Settings size={28} className="text-slate-500" />,
        color: 'bg-slate-100 border-slate-200 text-slate-700',
        title: 'Belum Dikonfigurasi',
        desc: 'Silakan masukkan detail koneksi database Anda untuk memulai aplikasi.'
      },
      CONNECTING: {
        icon: <Loader2 size={28} className="text-blue-500 animate-spin" />,
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        title: 'Sedang Menghubungkan...',
        desc: 'Mohon tunggu, sistem sedang mencoba terhubung ke database.'
      },
      CONNECTED: {
        icon: <CheckCircle2 size={28} className="text-green-500" />,
        color: 'bg-green-50 border-green-200 text-green-700',
        title: 'Terhubung',
        desc: 'Koneksi ke database berhasil divalidasi. Siap untuk disimpan.'
      },
      AUTH_FAILED: {
        icon: <AlertTriangle size={28} className="text-orange-500" />,
        color: 'bg-orange-50 border-orange-200 text-orange-700',
        title: 'Kredensial Ditolak',
        desc: 'Username atau password database salah. Harap periksa kembali detail kredensial Anda.'
      },
      NETWORK_ERROR: {
        icon: <AlertTriangle size={28} className="text-red-500" />,
        color: 'bg-red-50 border-red-200 text-red-700',
        title: 'Gangguan Jaringan',
        desc: 'Sistem tidak dapat menjangkau server database. Pastikan koneksi internet Anda stabil.'
      },
      SERVER_UNREACHABLE: {
        icon: <XCircle size={28} className="text-red-500" />,
        color: 'bg-red-50 border-red-200 text-red-700',
        title: 'Akses Ditolak (IP)',
        desc: 'Koneksi ditolak oleh server. Pastikan IP perangkat ini sudah diizinkan (Whitelist) di MongoDB Atlas.'
      },
      INVALID_FORMAT: {
        icon: <AlertTriangle size={28} className="text-orange-500" />,
        color: 'bg-orange-50 border-orange-200 text-orange-700',
        title: 'Format Tidak Valid',
        desc: 'Pastikan URL diawali dengan "mongodb://" atau "mongodb+srv://".'
      },
      FAILED: {
        icon: <XCircle size={28} className="text-red-500" />,
        color: 'bg-red-50 border-red-200 text-red-700',
        title: 'Koneksi Bermasalah',
        desc: 'Gagal terhubung ke database. Periksa kembali informasi koneksi Anda.'
      }
    }

    const current = statusMap[appStatus]

    return (
      <div
        className={`flex items-start gap-4 p-5 rounded-xl border ${current.color} transition-colors duration-300`}
      >
        <div className="shrink-0">{current.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">{current.title}</h3>
          <p className="text-sm opacity-90 leading-relaxed">{current.desc}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-sm">
              <Database size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Pengaturan Database</h2>
          <p className="text-sm text-slate-500 font-medium tracking-wide">MEDIA SCORING SYSTEM</p>
        </div>

        {/* Dynamic Status Header */}
        {renderStatusHeader()}

        {/* Input Section */}
        <div className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Link size={16} className="text-slate-400" />
              URL Koneksi Database
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Dapatkan URL ini dari menu <strong>Connect &gt; Drivers</strong> di panel MongoDB
              Atlas Anda.
            </p>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="Contoh: mongodb+srv://username:password@cluster.mongodb.net/"
              className="w-full px-4 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono bg-slate-50"
              disabled={isTesting || isSaving}
            />
          </div>

          {/* Connection Error / Success Card */}
          {testResult && (
            <div
              className={`mt-4 overflow-hidden rounded-xl border ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className="p-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {testResult.success ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <AlertTriangle size={20} className="text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`text-sm font-bold ${testResult.success ? 'text-green-800' : 'text-red-800'}`}
                  >
                    {testResult.translated.title}
                  </h4>
                  <p
                    className={`text-sm mt-1 leading-relaxed ${testResult.success ? 'text-green-700' : 'text-red-700'}`}
                  >
                    {testResult.translated.description}
                  </p>

                  {testResult.success && testResult.metadata && (
                    <div className="mt-3 p-3 bg-green-100/50 rounded-lg border border-green-200/50">
                      <div className="flex items-center gap-2 text-xs font-semibold text-green-800 mb-1">
                        <Database size={14} /> Database & Cluster Terdeteksi:
                      </div>
                      <div className="text-xs text-green-700 font-mono">
                        Cluster: {testResult.metadata.cluster}
                        <br />
                        Database: {testResult.metadata.database}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible Tech Details */}
              {!testResult.success && testResult.translated.original && (
                <div className="border-t border-red-200/50 bg-red-50/50">
                  <button
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-100/50 transition-colors"
                  >
                    <span>Detail Teknis (Untuk Administrator)</span>
                    {showTechDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {showTechDetails && (
                    <div className="px-4 pb-4">
                      <div className="bg-red-100/50 p-3 rounded-lg border border-red-200/50">
                        <code className="text-xs text-red-800 break-all whitespace-pre-wrap font-mono">
                          {testResult.translated.original}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions (Yang bisa Anda lakukan) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 px-1">Yang Bisa Anda Lakukan:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={handleTestConnection}
              disabled={isTesting || isSaving}
              className="flex justify-center items-center gap-2 py-3 shadow-sm"
            >
              <Database size={18} />
              {isTesting ? 'Menguji...' : 'Uji Koneksi'}
            </Button>

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isTesting || isSaving}
              className="flex justify-center items-center gap-2 py-3 shadow-sm"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan & Hubungkan'}
            </Button>

            <button
              onClick={openAtlas}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
            >
              <ExternalLink
                size={18}
                className="text-slate-400 group-hover:text-blue-500 transition-colors"
              />
              Buka MongoDB Atlas
            </button>

            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group"
            >
              <Info
                size={18}
                className="text-slate-400 group-hover:text-blue-500 transition-colors"
              />
              Panduan Membuat Database
            </button>
          </div>
        </div>

        {/* Simple Setup Guide Modal */}
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl w-full max-w-lg p-7 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Panduan Database</h3>
                  <p className="text-sm text-slate-500">Langkah-langkah mengatur MongoDB Atlas</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <ol className="list-decimal list-inside text-sm text-slate-700 space-y-3 font-medium">
                  <li>
                    Buat akun di situs <strong>MongoDB Atlas</strong>
                  </li>
                  <li>
                    Buat <strong>Project</strong> baru
                  </li>
                  <li>
                    Buat klaster (<strong>Cluster</strong>) database
                  </li>
                  <li>
                    Buat pengguna (<strong>Database User</strong>)
                  </li>
                  <li>
                    Izinkan akses jaringan (<strong>Network Access</strong>) ke{' '}
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-xs">0.0.0.0/0</code>
                  </li>
                  <li>
                    Pilih menu <strong>Connect</strong>
                  </li>
                  <li>
                    Pilih <strong>Drivers</strong>
                  </li>
                  <li>
                    Salin URL / <strong>MongoDB URI</strong> yang diberikan
                  </li>
                  <li>Tempelkan URL tersebut ke kolom di aplikasi ini</li>
                </ol>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => setShowHelp(false)}
                  className="w-full justify-center py-2.5"
                >
                  Saya Mengerti, Tutup Panduan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
