/**
 * ScoreCalculator Utility
 * Single Source of Truth for all scoring business rules.
 */

/**
 * Calculates the score of a single section based on selected answers.
 * Exposing as a public helper belonging to the scoring module.
 *
 * @param {Object} answers Key-value of questionId: selectedOptionValue
 * @param {Object} section Section configuration object containing questions
 * @returns {number} The score for this section
 */
export function calculateSectionScore(answers, section) {
  if (!answers || !section || !Array.isArray(section.questions)) {
    return 0
  }

  let sectionScore = 0

  section.questions.forEach((question) => {
    const selectedValue = answers[question.id]
    if (selectedValue !== undefined && selectedValue !== null) {
      const matchedOption = question.options.find(
        (opt) => String(opt.value) === String(selectedValue)
      )
      if (matchedOption && typeof matchedOption.points === 'number') {
        sectionScore += matchedOption.points
      }
    }
  })

  return sectionScore
}

/**
 * Calculates the grand total score by summing up all section scores.
 * Uses calculateSectionScore to prevent logic duplication.
 *
 * @param {Object} answers Key-value of questionId: selectedOptionValue
 * @param {Array} criteriaList Array of sections
 * @returns {number} The grand total score
 */
export function calculateScore(answers, criteriaList) {
  if (!answers || !criteriaList || !Array.isArray(criteriaList)) {
    return 0
  }

  return criteriaList.reduce((sum, section) => sum + calculateSectionScore(answers, section), 0)
}

export default calculateScore
