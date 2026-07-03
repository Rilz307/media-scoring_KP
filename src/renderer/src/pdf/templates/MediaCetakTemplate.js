import { PDF_CONFIG } from '../constants/pdfConfig'
import pdfTemplateMap from '../config/pdfTemplateMap'

/**
 * MediaCetakTemplate.js
 *
 * Pure data-mapper for the CETAK document layout (5 columns).
 * Translates the canonical ReportBuilder output into PDF rows, utilizing
 * pdfTemplateMap to decouple presentation logic from the domain.
 */
class MediaCetakTemplate {
  static compile(report) {
    const headers = ['NO', 'URAIKAN KRITERIA', 'SUB URAINKAN', 'STATUS', 'CEKLIS PADA']
    const bodyRows = []

    let questionIndex = 1

    report.sections.forEach((section) => {
      section.questions.forEach((question) => {
        const optionCount = question.options.length
        const qMap = pdfTemplateMap.CETAK[question.id] || { options: {} }

        question.options.forEach((option, idx) => {
          const isSelected = question.answerValue === option.value
          const checkMark = isSelected ? PDF_CONFIG.SYMBOLS.CHECKED : PDF_CONFIG.SYMBOLS.UNCHECKED

          // Apply mapping from pdfTemplateMap or fallback to defaults
          const optMap = qMap.options[option.value] || {}
          const subUraianText = optMap.subUraian !== undefined ? optMap.subUraian : option.label
          const statusText = optMap.status !== undefined ? optMap.status : ''

          if (idx === 0) {
            bodyRows.push([
              {
                content: questionIndex.toString(),
                rowSpan: optionCount,
                styles: { halign: 'center' }
              },
              { content: question.label, rowSpan: optionCount },
              { content: subUraianText },
              { content: statusText },
              {
                content: checkMark,
                styles: { halign: 'center', fontStyle: isSelected ? 'bold' : 'normal' }
              }
            ])
          } else {
            bodyRows.push([
              { content: subUraianText },
              { content: statusText },
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
      0: { cellWidth: 12.2 },
      1: { cellWidth: 59.5 },
      2: { cellWidth: 41.6 },
      3: { cellWidth: 26.6 },
      4: { cellWidth: 25.2 }
    }

    return {
      headers,
      bodyRows,
      customColumnStyles
    }
  }
}

export default MediaCetakTemplate
