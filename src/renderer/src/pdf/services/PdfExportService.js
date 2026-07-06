import RekapitulasiViewModel from '../../documents/builders/RekapitulasiViewModel'
import HtmlPdfRenderer from '../../documents/renderer/HtmlPdfRenderer'
import rekapitulasiTemplate from '../../documents/templates/rekapitulasi.html?raw'
import MediaDetailViewModel from '../../documents/builders/MediaDetailViewModel'
import mediaDetailTemplate from '../../documents/templates/media-detail.html?raw'

/**
 * PdfExportService.js
 *
 * Orchestration layer ONLY.
 * Selects template → calls builder primitives → returns builder.
 *
 * Rules (enforced here):
 *   - All documents are portrait-only.
 *   - Preview and download are strictly separated.
 *   - No scoring / grading / layout logic lives here.
 */
class PdfExportService {
  static async previewMediaReport(mediaRecord) {
    if (!mediaRecord) {
      throw new Error('Data media tidak valid untuk diekspor.')
    }
    const viewModel = MediaDetailViewModel.build(mediaRecord)
    const htmlString = HtmlPdfRenderer.renderToHtml(mediaDetailTemplate, viewModel)
    return {
      isHtml: true,
      htmlContent: htmlString,
      filename: `Laporan_Verifikasi_${mediaRecord.jenis}_${mediaRecord.nama_media}.pdf`
    }
  }

  static async downloadMediaReport(mediaRecord) {
    if (!mediaRecord) {
      throw new Error('Data media tidak valid untuk diekspor.')
    }
    const viewModel = MediaDetailViewModel.build(mediaRecord)
    const htmlString = HtmlPdfRenderer.renderToHtml(mediaDetailTemplate, viewModel)
    const pdfBuffer = await HtmlPdfRenderer.printToPdfBuffer(htmlString)

    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Laporan_Verifikasi_${mediaRecord.jenis}_${mediaRecord.nama_media}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

  static _buildRekapitulasi(mediaList) {
    if (!mediaList || mediaList.length === 0) {
      throw new Error('Tidak ada data media untuk diekspor.')
    }
  }

  static async previewRekapitulasi(mediaList) {
    const viewModel = RekapitulasiViewModel.build(mediaList)
    const htmlString = HtmlPdfRenderer.renderToHtml(rekapitulasiTemplate, viewModel)
    return {
      isHtml: true,
      htmlContent: htmlString,
      filename: `Rekapitulasi_Persetujuan_${new Date().getTime()}.pdf`
    }
  }

  static async downloadRekapitulasi(mediaList) {
    const viewModel = RekapitulasiViewModel.build(mediaList)
    const htmlString = HtmlPdfRenderer.renderToHtml(rekapitulasiTemplate, viewModel)
    const pdfBuffer = await HtmlPdfRenderer.printToPdfBuffer(htmlString)

    const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Rekapitulasi_Persetujuan_${new Date().getTime()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }
}

export default PdfExportService
