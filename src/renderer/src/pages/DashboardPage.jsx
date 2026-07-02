import { useState, useEffect, useMemo } from 'react'
import { Search, Plus, FileText, AlertTriangle } from 'lucide-react'
import MediaService from '../services/MediaService'

export default function DashboardPage() {
  const [mediaList, setMediaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('Semua Jenis')
  const [filterGrade, setFilterGrade] = useState('Semua Grade')
  const [sortBy, setSortBy] = useState('recently_modified')

  const handleRefresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await MediaService.getAll()
      setMediaList(data)
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke database. Silakan periksa koneksi Anda.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const data = await MediaService.getAll()
        if (active) {
          setMediaList(data)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal terhubung ke database. Silakan periksa koneksi Anda.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [])

  // Formatter for timestamps (e.g. 02 Jul 2026 14:35)
  const formatTimestamp = (isoString) => {
    if (!isoString) return '-'
    try {
      const date = new Date(isoString)
      if (isNaN(date.getTime())) return '-'
      const day = String(date.getDate()).padStart(2, '0')
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'Mei',
        'Jun',
        'Jul',
        'Agu',
        'Sep',
        'Okt',
        'Nov',
        'Des'
      ]
      const month = months[date.getMonth()]
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${day} ${month} ${year} ${hours}:${minutes}`
    } catch {
      return '-'
    }
  }

  // Filter list locally
  const filteredMediaList = useMemo(() => {
    return mediaList.filter((media) => {
      const matchSearch = searchQuery
        ? (media.nama_media || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (media.perusahaan || '').toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchType = filterType === 'Semua Jenis' || media.jenis === filterType
      const matchGrade = filterGrade === 'Semua Grade' || media.grade === filterGrade

      return matchSearch && matchType && matchGrade
    })
  }, [mediaList, searchQuery, filterType, filterGrade])

  // Sort list locally
  const sortedMediaList = useMemo(() => {
    const list = [...filteredMediaList]
    return list.sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return (a.nama_media || '').localeCompare(b.nama_media || '')
        case 'name_desc':
          return (b.nama_media || '').localeCompare(a.nama_media || '')
        case 'score_highest':
          return (b.totalScore || 0) - (a.totalScore || 0)
        case 'score_lowest':
          return (a.totalScore || 0) - (b.totalScore || 0)
        case 'grade':
          return (a.grade || '').localeCompare(b.grade || '')
        case 'recently_modified': {
          const tA = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const tB = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return tB - tA
        }
        case 'oldest_modified': {
          const tA = new Date(a.updatedAt || a.createdAt || 0).getTime()
          const tB = new Date(b.updatedAt || b.createdAt || 0).getTime()
          return tA - tB
        }
        default:
          return 0
      }
    })
  }, [filteredMediaList, sortBy])

  return (
    <div className="space-y-6">
      {/* Header / Action Area */}
      <div className="flex items-end justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola seluruh data media yang telah dinilai.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white hover:bg-blue-700 transition shadow-sm font-semibold text-sm">
          <Plus size={16} />
          Tambah Media
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari media..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs focus:border-blue-500 focus:outline-none transition bg-white"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none transition bg-white"
          >
            <option>Semua Jenis</option>
            <option>SIBER</option>
            <option>CETAK</option>
            <option>ELEKTRONIK</option>
          </select>

          <select
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            className="rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:border-blue-500 focus:outline-none transition bg-white"
          >
            <option>Semua Grade</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-200 p-2 text-xs text-slate-700 font-semibold focus:border-blue-500 focus:outline-none transition bg-white"
          >
            <option value="recently_modified">Terakhir Dimodifikasi</option>
            <option value="oldest_modified">Modifikasi Terlama</option>
            <option value="name_asc">Nama (A-Z)</option>
            <option value="name_desc">Nama (Z-A)</option>
            <option value="score_highest">Skor Tertinggi</option>
            <option value="score_lowest">Skor Terendah</option>
            <option value="grade">Grade (A-C)</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-150">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-150 text-slate-600 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 text-left font-semibold">Nama Media</th>
              <th className="p-4 text-left font-semibold">Jenis Media</th>
              <th className="p-4 text-left font-semibold">Grade</th>
              <th className="p-4 text-left font-semibold">Skor</th>
              <th className="p-4 text-left font-semibold">Terakhir Dimodifikasi</th>
              <th className="p-4 text-center font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-150 text-slate-700 text-sm">
            {/* Loading Skeleton State */}
            {loading && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {/* Error State */}
            {!loading && error && (
              <tr>
                <td colSpan="6" className="p-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-md mx-auto space-y-4">
                    <div className="bg-red-50 p-3 rounded-full text-red-500 border border-red-100">
                      <AlertTriangle size={32} />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-bold text-lg">
                        Tidak dapat terhubung ke database.
                      </h3>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        Pastikan koneksi internet tersedia, klaster MongoDB Atlas aktif, dan
                        konfigurasi environment file (`.env`) Anda sudah benar.
                      </p>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-white transition font-semibold text-xs shadow-md"
                    >
                      Coba Lagi
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Empty State */}
            {!loading && !error && sortedMediaList.length === 0 && (
              <tr>
                <td colSpan="6" className="p-20 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-4">
                    <div className="bg-slate-100 p-4 rounded-full text-slate-400 border border-slate-200">
                      <FileText size={40} />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-bold text-lg">Belum Ada Data Media</h3>
                      <p className="text-slate-400 text-sm mt-1">
                        Klik &quot;Tambah Media&quot; untuk menambahkan data media pertama.
                      </p>
                    </div>
                    <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition font-semibold text-xs shadow-sm">
                      <Plus size={14} />
                      Tambah Media
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!loading &&
              !error &&
              sortedMediaList.map((media) => (
                <tr key={media._id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{media.nama_media}</div>
                    {media.perusahaan && (
                      <div className="text-xs text-slate-400 font-normal mt-0.5">
                        {media.perusahaan}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-slate-500 font-semibold">{media.jenis}</td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                        media.grade === 'A'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : media.grade === 'B'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-250'
                            : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      Grade {media.grade || '-'}
                    </span>
                  </td>

                  <td className="p-4 font-bold text-slate-900">{media.totalScore}</td>

                  <td className="p-4 text-slate-500 font-medium">
                    {formatTimestamp(media.updatedAt || media.createdAt)}
                  </td>

                  <td className="p-4 text-center space-x-2">
                    <button className="rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 text-xs font-bold text-sky-700 transition">
                      Detail
                    </button>

                    <button className="rounded-lg bg-yellow-50 hover:bg-yellow-100 border border-yellow-250 px-3 py-1.5 text-xs font-bold text-yellow-700 transition">
                      Edit
                    </button>

                    <button className="rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 transition">
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Pulse skeleton table rows for modern loading state
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </td>
      <td className="p-4">
        <div className="h-6 bg-slate-200 rounded-full w-12"></div>
      </td>
      <td className="p-4 font-bold text-slate-900">
        <div className="h-4 bg-slate-200 rounded w-8"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-slate-150 rounded w-28"></div>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 bg-slate-200 rounded-lg w-12"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-12"></div>
          <div className="h-8 bg-slate-200 rounded-lg w-12"></div>
        </div>
      </td>
    </tr>
  )
}
