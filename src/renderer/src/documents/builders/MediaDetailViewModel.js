import normalizeReport from '../../utils/ReportBuilder'
import mediaCriteria from '../../constants/mediaCriteria'
import { PDF_CONFIG } from '../../pdf/constants/pdfConfig'
import pdfTemplateMap from '../../pdf/config/pdfTemplateMap'

export default class MediaDetailViewModel {
  static build(mediaRecord) {
    const report = normalizeReport(mediaRecord, mediaCriteria)

    let rowsHtml = ''
    let counter = 1

    if (report.sections && report.sections.length > 0) {
      report.sections.forEach((section) => {
        if (section.questions && section.questions.length > 0) {
          section.questions.forEach((question) => {
            const optionCount = question.options.length
            const qMap =
              report.jenis === 'CETAK' ? pdfTemplateMap.CETAK[question.id] || { options: {} } : null

            if (optionCount > 0) {
              question.options.forEach((option, idx) => {
                const isSelected = question.answerValue === option.value
                const checkMark = isSelected
                  ? PDF_CONFIG.SYMBOLS.CHECKED
                  : PDF_CONFIG.SYMBOLS.UNCHECKED
                const fontWeight = isSelected ? 'bold' : 'normal'

                if (report.jenis === 'CETAK') {
                  const optMap = qMap.options[option.value] || {}
                  const subUraianText =
                    optMap.subUraian !== undefined ? optMap.subUraian : option.label
                  const statusText = optMap.status !== undefined ? optMap.status : ''

                  if (idx === 0) {
                    rowsHtml += `
                      <tr>
                        <td rowspan="${optionCount}" style="text-align: center; vertical-align: middle;">${counter}</td>
                        <td rowspan="${optionCount}" style="vertical-align: middle;">${question.label}</td>
                        <td>${subUraianText}</td>
                        <td>${statusText}</td>
                        <td style="text-align: center; font-weight: ${fontWeight};">${checkMark}</td>
                      </tr>
                    `
                  } else {
                    rowsHtml += `
                      <tr>
                        <td>${subUraianText}</td>
                        <td>${statusText}</td>
                        <td style="text-align: center; font-weight: ${fontWeight};">${checkMark}</td>
                      </tr>
                    `
                  }
                } else {
                  if (idx === 0) {
                    rowsHtml += `
                      <tr>
                        <td rowspan="${optionCount}" style="text-align: center; vertical-align: middle;">${counter}</td>
                        <td rowspan="${optionCount}" style="vertical-align: middle;">${question.label}</td>
                        <td>${option.label}</td>
                        <td style="text-align: center; font-weight: ${fontWeight};">${checkMark}</td>
                      </tr>
                    `
                  } else {
                    rowsHtml += `
                      <tr>
                        <td>${option.label}</td>
                        <td style="text-align: center; font-weight: ${fontWeight};">${checkMark}</td>
                      </tr>
                    `
                  }
                }
              })
            }
            counter++
          })
        }
      })
    }

    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    let headersHtml = ''
    if (report.jenis === 'CETAK') {
      headersHtml = `
        <tr>
          <th style="width: 5%;">NO</th>
          <th style="width: 30%;">URAIKAN KRITERIA</th>
          <th style="width: 25%;">SUB URAINKAN</th>
          <th style="width: 25%;">STATUS</th>
          <th style="width: 15%;">CEKLIS PADA</th>
        </tr>
      `
    } else if (report.jenis === 'SIBER') {
      headersHtml = `
        <tr>
          <th style="width: 5%;">NO</th>
          <th style="width: 35%;">URAIAN KRITERIA</th>
          <th style="width: 45%;">FAKTOR VERIFIKASI</th>
          <th style="width: 15%;">CEKLIS PADA KOLOM</th>
        </tr>
      `
    } else {
      headersHtml = `
        <tr>
          <th style="width: 5%;">NO</th>
          <th style="width: 35%;">URAIAN KRITEIA</th>
          <th style="width: 45%;">FAKTOR VERIFIKASI</th>
          <th style="width: 15%;">CEKLIS PADA</th>
        </tr>
      `
    }

    return {
      nama_media: report.nama_media || '..................',
      perusahaan: report.perusahaan || '..................',
      tableHeaders: headersHtml,
      tableRows: rowsHtml,
      tanggal: dateStr
    }
  }
}
