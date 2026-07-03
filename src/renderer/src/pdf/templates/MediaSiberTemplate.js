import { PDF_CONFIG } from '../constants/pdfConfig'

/**
 * MediaSiberTemplate.js
 *
 * Pure data-mapper for the SIBER document layout (4 columns).
 * Takes the canonical ReportBuilder output and returns PDF drawing instructions.
 */
class MediaSiberTemplate {
  static compile(report) {
    const headers = ['NO', 'URAIAN KRITERIA', 'FAKTOR VERIFIKASI', 'CEKLIS PADA KOLOM']
    const bodyRows = []

    let questionIndex = 1

    report.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const optionCount = question.options.length

        question.options.forEach((option, idx) => {
          const isSelected = question.answerValue === option.value
          const checkMark = isSelected ? PDF_CONFIG.SYMBOLS.CHECKED : PDF_CONFIG.SYMBOLS.UNCHECKED

          if (idx === 0) {
            // First row gets the NO and URAIAN cells spanning all options
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
            // Subsequent rows only need the option cells (jsPDF autotable skips spanned columns)
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
      1: { cellWidth: 75.0 },
      2: { cellWidth: 50.1 },
      3: { cellWidth: 25.8 }
    }

    return {
      headers,
      bodyRows,
      customColumnStyles
    }
  }
}

export default MediaSiberTemplate
