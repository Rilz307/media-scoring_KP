import { useState, useEffect, useMemo } from 'react'
import mediaCriteria, { criteriaVersion } from '../../constants/mediaCriteria'
import gradeRules from '../../constants/gradeRules'
import calculateScore from '../../utils/ScoreCalculator'
import calculateGrade from '../../utils/GradeCalculator'
import DynamicForm from './DynamicForm'
import ScoreSummary from './ScoreSummary'

/**
 * Reusable MediaForm for creating and editing media entries with assessment engine.
 */
function MediaForm({ initialData = null, onSave, onCancel, loading = false, storageStats = null }) {
  const [form, setForm] = useState({
    nama_media: '',
    perusahaan: '',
    jenis: 'SIBER',
    alamat: '',
    telepon: '',
    email: '',
    website: ''
  })
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [attachments, setAttachments] = useState([])

  const totalScore = useMemo(() => {
    const criteriaList = mediaCriteria[form.jenis] || []
    return calculateScore(answers, criteriaList)
  }, [answers, form.jenis])
  const grade = useMemo(() => {
    if (!gradeRules || !gradeRules.enabled || !gradeRules.rules) return null
    return calculateGrade(totalScore, gradeRules.rules[form.jenis])
  }, [totalScore, form.jenis])

  // Load initial data for Edit Mode
  useEffect(() => {
    if (initialData) {
      Promise.resolve().then(() => {
        setForm({
          nama_media: initialData.nama_media || '',
          perusahaan: initialData.perusahaan || '',
          jenis: initialData.jenis || 'SIBER',
          alamat: initialData.alamat || '',
          telepon: initialData.telepon || '',
          email: initialData.email || '',
          website: initialData.website || ''
        })
        setAnswers(initialData.answers || {})
        setAttachments(initialData.attachments || [])
      })
    }
  }, [initialData])

  const handleAttachFile = (requirementKey, file) => {
    const newAttachment = {
      id: crypto.randomUUID(),
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      requirementKey,
      localFile: file,
      isQueued: true
    }
    setAttachments((prev) => [...prev, newAttachment])
  }

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear error inline when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    // Reset answers if changing media type
    if (name === 'jenis') {
      setAnswers({})
    }
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))

    // Clear error inline when selecting
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Nama Media
    if (!form.nama_media || !form.nama_media.trim()) {
      newErrors.nama_media = 'Nama media wajib diisi.'
    } else if (form.nama_media.trim().length < 3) {
      newErrors.nama_media = 'Nama media minimal 3 karakter.'
    }

    // Nama Perusahaan
    if (!form.perusahaan || !form.perusahaan.trim()) {
      newErrors.perusahaan = 'Nama perusahaan wajib diisi.'
    }

    // Email (optional, validate format if provided)
    if (form.email && form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = 'Format email tidak valid.'
      }
    }

    // Website (optional, validate format if provided)
    if (form.website && form.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/ \w.-]*)*\/?$/i
      if (!urlRegex.test(form.website.trim())) {
        newErrors.website = 'Format URL website tidak valid.'
      }
    }

    // Telepon (optional, validate character restrictions if provided)
    if (form.telepon && form.telepon.trim()) {
      const phoneRegex = /^[0-9+\s\-()]+$/
      if (!phoneRegex.test(form.telepon.trim())) {
        newErrors.telepon = 'Nomor telepon hanya boleh berisi angka dan simbol (+, -, (), spasi).'
      }
    }

    // Mandatory question validation
    const criteriaList = mediaCriteria[form.jenis] || []
    criteriaList.forEach((section) => {
      if (section && Array.isArray(section.questions)) {
        section.questions.forEach((question) => {
          if (question.required) {
            const ans = answers[question.id]
            if (ans === undefined || ans === null || String(ans).trim() === '') {
              newErrors[question.id] = `Pertanyaan ini wajib dijawab.`
            }
          }
        })
      }
    })

    // Verify totalScore is a valid finite number
    if (typeof totalScore !== 'number' || isNaN(totalScore) || !isFinite(totalScore)) {
      newErrors.totalScore = 'Perhitungan nilai total tidak valid.'
    }

    // Verify answers is a valid object
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      newErrors.answers = 'Data jawaban tidak valid.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...form,
        answers,
        totalScore,
        grade,
        criteriaVersion,
        attachments
      })
    } else {
      setErrors((prev) => ({
        ...prev,
        global: 'Mohon lengkapi seluruh kriteria wajib dan data administrasi dengan benar.'
      }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.global && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 text-red-700">
          <div className="space-y-1">
            <span className="font-bold text-sm">Validasi Gagal</span>
            <p className="text-xs text-red-600 leading-relaxed">{errors.global}</p>
          </div>
        </div>
      )}
      {/* 1. Administrative Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Informasi Administrasi Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Media */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nama Media <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama_media"
              value={form.nama_media}
              onChange={handleChange}
              placeholder="Contoh: Media Sultra Mandiri"
              className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none transition ${
                errors.nama_media
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.nama_media && <span className="text-xs text-red-500">{errors.nama_media}</span>}
          </div>

          {/* Nama Perusahaan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nama Perusahaan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="perusahaan"
              value={form.perusahaan}
              onChange={handleChange}
              placeholder="Contoh: PT Sultra Pers Mandiri"
              className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none transition ${
                errors.perusahaan
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.perusahaan && <span className="text-xs text-red-500">{errors.perusahaan}</span>}
          </div>

          {/* Jenis Media */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jenis Media <span className="text-red-500">*</span>
            </label>
            <select
              name="jenis"
              value={form.jenis}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition bg-white"
              disabled={loading}
            >
              <option value="SIBER">SIBER (Media Online)</option>
              <option value="CETAK">CETAK (Koran/Tabloid)</option>
              <option value="ELEKTRONIK">ELEKTRONIK (TV/Radio)</option>
            </select>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Contoh: redaksi@sultramandiri.com"
              className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none transition ${
                errors.email
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          {/* Telepon */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="telepon"
              value={form.telepon}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none transition ${
                errors.telepon
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.telepon && <span className="text-xs text-red-500">{errors.telepon}</span>}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Website URL
            </label>
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="Contoh: https://sultramandiri.com"
              className={`w-full rounded-lg border p-2.5 text-sm focus:outline-none transition ${
                errors.website
                  ? 'border-red-400 focus:border-red-500 bg-red-50/20'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
              disabled={loading}
            />
            {errors.website && <span className="text-xs text-red-500">{errors.website}</span>}
          </div>

          {/* Alamat */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Alamat Kantor
            </label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Contoh: Jl. Ahmad Yani No. 12, Kel. Anaiwoi, Kec. Kadia"
              rows="3"
              className="w-full rounded-lg border border-slate-200 p-2.5 text-sm focus:border-blue-500 focus:outline-none transition resize-none"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* 2. Assessment Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Kriteria Penilaian ({form.jenis})
        </h2>

        <DynamicForm
          mediaType={form.jenis}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          validationErrors={errors}
          disabled={loading}
          attachments={attachments}
          onAttach={handleAttachFile}
          onRemove={handleRemoveAttachment}
          storageStats={storageStats}
        />
      </div>

      {/* 3. Live Score Preview Panel */}
      <ScoreSummary
        totalScore={totalScore}
        grade={grade}
        gradeEnabled={gradeRules.enabled}
        mediaType={form.jenis}
        answers={answers}
      />

      {/* 4. Controls */}
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          disabled={loading}
        >
          Batal
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan Data Media'}
        </button>
      </div>
    </form>
  )
}

export default MediaForm
