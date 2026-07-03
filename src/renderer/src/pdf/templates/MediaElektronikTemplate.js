import { PDF_CONFIG } from '../constants/pdfConfig'

/**
 * MediaElektronikTemplate.js
 *
 * Pure data-mapper for the ELEKTRONIK document layout (4 columns).
 * Takes the canonical ReportBuilder output and returns PDF drawing instructions.
 */
class MediaElektronikTemplate {
  static compile(report) {
    const headers = ['NO', 'URAIAN KRITEIA', 'FAKTOR VERIFIKASI', 'CEKLIS PADA']
    const bodyRows = []

    let questionIndex = 1

    report.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const optionCount = question.options.length

        question.options.forEach((option, idx) => {
          const isSelected = question.answerValue === option.value
          const checkMark = isSelected ? PDF_CONFIG.SYMBOLS.CHECKED : PDF_CONFIG.SYMBOLS.UNCHECKED

          if (idx === 0) {
            bodyRows.push([
              {
                content: questionIndex.toString(),
                rowSpan: optionCount,
                styles: { halign: 'center' }
              },
              { content: question.label, rowSpan: optionCount },
              { content: option.label },
              {
                content: checkMark,
                styles: { halign: 'center', fontStyle: isSelected ? 'bold' : 'normal' }
              }
            ])
          } else {
            bodyRows.push([
              { content: option.label },
              {
                content: checkMark,
                styles: { halign: 'center', fontStyle: isSelected ? 'bold' : 'normal' }
              }
            ])
          }
        })
        questionIndex++
      })
    })

    const customColumnStyles = {
      0: { cellWidth: 14.1 },
      1: { cellWidth: 62.0 },
      2: { cellWidth: 53.1 },
      3: { cellWidth: 35.8 }
    }

    return {
      headers,
      bodyRows,
      customColumnStyles
    }
  }
}

export default MediaElektronikTemplate
