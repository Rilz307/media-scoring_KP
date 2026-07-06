/**
 * Official Assessment Grade Rules Configuration
 *
 * Sourced directly from PERWALI Kota Kendari Nomor 36 Tahun 2023.
 * All wording, typos, and formatting match the official forms exactly.
 */
export const gradeRules = {
  enabled: true,
  rules: {
    CETAK: [
      { minScore: 101, grade: 'Tingkat I' },
      { minScore: 81, grade: 'Tingkat II' },
      { minScore: 61, grade: 'Tingkat III' },
      { minScore: 0, grade: 'Tingkat IV' }
    ],
    SIBER: [
      { minScore: 101, grade: 'Tingkat I' },
      { minScore: 81, grade: 'Tingkat II' },
      { minScore: 61, grade: 'Tingkat III' },
      { minScore: 0, grade: 'Tingkat IV' }
    ],
    ELEKTRONIK: [
      { minScore: 21, grade: 'Tingkat I' },
      { minScore: 17, grade: 'Tingkat II' },
      { minScore: 13, grade: 'Tingkat III' },
      { minScore: 0, grade: 'Tingkat IV' }
    ]
  }
}

export default gradeRules
