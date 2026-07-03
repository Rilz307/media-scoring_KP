import { calculateSectionScore } from './ScoreCalculator'

/**
 * Normalized Report Object Builder
 * Pure presentation-ready normalization layer.
 * Does not implement or recalculate any scoring rules or grand totals.
 *
 * @param {Object} media MongoDB media document
 * @param {Object} mediaCriteria Full media criteria configurations
 * @returns {Object|null} The normalized report object
 */
export function normalizeReport(media, mediaCriteria) {
  if (!media) return null

  const mediaType = media.jenis || 'SIBER'
  const sectionsConfig = mediaCriteria[mediaType] || []
  const answers = media.answers || {}

  // Map configuration metadata to answers dynamically for presentation
  const sections = sectionsConfig.map((section) => {
    // Treat calculateSectionScore as a black box to derive subtotals
    const subtotal = calculateSectionScore(answers, section)

    const questions = (section.questions || []).map((question) => {
      const answerValue = answers[question.id]
      const matchedOption = question.options.find(
        (opt) => String(opt.value) === String(answerValue)
      )

      return {
        id: question.id,
        label: question.label,
        required: question.required,
        answerValue: matchedOption ? matchedOption.value : answerValue || null,
        answerLabel: matchedOption ? matchedOption.label : 'Belum dijawab',
        points: matchedOption ? matchedOption.points : 0,
        options: question.options ?? []
      }
    })

    return {
      id: section.id,
      title: section.title,
      questions,
      subtotal
    }
  })

  return {
    id: media._id || media.id,
    nama_media: media.nama_media || '',
    perusahaan: media.perusahaan || '',
    jenis: mediaType,
    alamat: media.alamat || '',
    telepon: media.telepon || '',
    email: media.email || '',
    website: media.website || '',
    createdAt: media.createdAt || null,
    updatedAt: media.updatedAt || null,
    criteriaVersion: media.criteriaVersion || null,
    sections,
    // Read totalScore and grade directly from the database record (no recalculation)
    totalScore: typeof media.totalScore === 'number' ? media.totalScore : 0,
    grade: media.grade || null
  }
}

export default normalizeReport
