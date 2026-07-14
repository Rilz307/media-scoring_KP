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

    const attachments = report.attachments || []

    let attachmentRowsHtml = ''
    let attachmentNo = 1

    const otherKeys = [...new Set(attachments.map((a) => a.requirementKey || 'UMUM'))]

    otherKeys.forEach((key) => {
      const matchedFiles = attachments.filter((a) => (a.requirementKey || 'UMUM') === key)
      if (matchedFiles.length === 0) return

      let label = key === 'UMUM' ? 'Lain-lain / Pendukung Ekstra' : `Bukti: ${key}`

      if (key !== 'UMUM') {
        for (const sec of report.sections) {
          for (const q of sec.questions) {
            if (q.id === key) {
              label = `Bukti: ${q.label}`
              break
            }
          }
        }
      }

      let filesHtml = ''
      if (matchedFiles.length <= 2) {
        filesHtml = matchedFiles.map((f) => f.originalName).join('<br />')
      } else {
        filesHtml =
          matchedFiles
            .slice(0, 2)
            .map((f) => f.originalName)
            .join('<br />') + `<br /><i>+${matchedFiles.length - 2} file lainnya</i>`
      }

      attachmentRowsHtml += `
        <tr>
          <td style="text-align: center;">${attachmentNo++}</td>
          <td>${label}</td>
          <td style="text-align: center;">Dilampirkan</td>
          <td>${filesHtml}</td>
        </tr>
      `
    })

    let attachmentTableHtml = ''
    if (attachmentRowsHtml) {
      attachmentTableHtml = `
      <div style="margin-bottom: 20pt; page-break-inside: auto;">
        <h3 style="font-size: 11pt; margin-bottom: 8pt; font-weight: bold;">DAFTAR KELENGKAPAN DOKUMEN</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">NO</th>
              <th style="width: 40%;">JENIS DOKUMEN</th>
              <th style="width: 20%;">STATUS</th>
              <th style="width: 35%;">NAMA FILE</th>
            </tr>
          </thead>
          <tbody>
            ${attachmentRowsHtml}
          </tbody>
        </table>
      </div>
      `
    }

    return {
      nama_media: report.nama_media || '..................',
      perusahaan: report.perusahaan || '..................',
      tableHeaders: headersHtml,
      tableRows: rowsHtml,
      attachmentTable: attachmentTableHtml,
      tanggal: dateStr
    }
  }
}
