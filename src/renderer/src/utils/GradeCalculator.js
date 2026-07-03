/**
 * Determines the grade based on total score and grade rules configuration.
 * Zero hardcoded grade letters or numeric thresholds.
 *
 * @param {number} totalScore The summed points
 * @param {Object} gradeRules Config object with 'enabled' toggle and 'thresholds' list
 * @returns {string|null} The resolved grade name, or null if disabled
 */
export function calculateGrade(totalScore, gradeRules) {
  if (!gradeRules || !gradeRules.enabled || !Array.isArray(gradeRules.thresholds)) {
    return null
  }

  // Sort thresholds by minScore in descending order
  const sortedThresholds = [...gradeRules.thresholds].sort((a, b) => b.minScore - a.minScore)

  // Find the first threshold where totalScore is greater than or equal to minScore
  const matchedRule = sortedThresholds.find((rule) => totalScore >= rule.minScore)

  return matchedRule ? matchedRule.grade : null
}

export default calculateGrade
