/**
 * Determines the grade based on total score and specific media rules.
 * Zero hardcoded grade letters or numeric thresholds.
 *
 * @param {number} totalScore The summed points
 * @param {Array} rules Array of threshold objects {minScore, grade}
 * @returns {string|null} The resolved grade name, or null if invalid rules
 */
export function calculateGrade(totalScore, rules) {
  if (!Array.isArray(rules)) {
    return null
  }

  // Sort thresholds by minScore in descending order
  const sortedThresholds = [...rules].sort((a, b) => b.minScore - a.minScore)

  // Find the first threshold where totalScore is greater than or equal to minScore
  const matchedRule = sortedThresholds.find((rule) => totalScore >= rule.minScore)

  return matchedRule ? matchedRule.grade : null
}

export default calculateGrade
