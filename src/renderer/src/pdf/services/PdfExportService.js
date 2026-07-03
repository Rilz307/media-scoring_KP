import normalizeReport from '../../utils/ReportBuilder'
import mediaCriteria from '../../constants/mediaCriteria'
import PdfDocumentBuilder from '../builders/PdfDocumentBuilder'
import MediaSiberTemplate from '../templates/MediaSiberTemplate'
import MediaCetakTemplate from '../templates/MediaCetakTemplate'
import MediaElektronikTemplate from '../templates/MediaElektronikTemplate'
import PersetujuanTemplate from '../templates/PersetujuanTemplate'
import documentSettings from '../../config/documentSettings'

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
  static _buildMediaReport(mediaRecord) {
    if (!mediaRecord) {
      throw new Error('Data media tidak valid untuk diekspor.')
    }

    // 1. Get canonical normalized representation (Single Source of Truth)
    const report = normalizeReport(mediaRecord, mediaCriteria)

    if (!report.sections || report.sections.length === 0) {
      throw new Error('Konfigurasi penilaian belum tersedia atau kosong.')
    }

    // 2. Select the correct template mapper
    let templateConfig
    if (report.jenis === 'SIBER') {
      templateConfig = MediaSiberTemplate.compile(report)
    } else if (report.jenis === 'CETAK') {
      templateConfig = MediaCetakTemplate.compile(report)
    } else if (report.jenis === 'ELEKTRONIK') {
      templateConfig = MediaElektronikTemplate.compile(report)
    } else {
      throw new Error(`Template export PDF untuk jenis media "${report.jenis}" belum didukung.`)
    }

    // 3. Orchestrate drawing — PORTRAIT ONLY, no exceptions
    const builder = new PdfDocumentBuilder({ orientation: 'portrait' })

    // Draw Company Header
    builder.drawCompanyHeader(report.nama_media, report.perusahaan)

    // Draw Formatted Table — reserve footer zone so table cannot overlap signature
    builder.drawTable(
      templateConfig.headers,
      templateConfig.bodyRows,
      templateConfig.customColumnStyles,
      builder.SIGNATURE_RESERVED_HEIGHT
    )

    // Draw Footer Declaration & Signature
    builder.drawCompanyDeclarationAndSignature(report.perusahaan)

    return builder
  }

  static previewMediaReport(mediaRecord) {
    const builder = this._buildMediaReport(mediaRecord)
    return {
      blobUrl: builder.getBlobUrl(),
      filename: `Laporan_Verifikasi_${mediaRecord.jenis}_${mediaRecord.nama_media}.pdf`
    }
  }

  static downloadMediaReport(mediaRecord) {
    const builder = this._buildMediaReport(mediaRecord)
    builder.save(`Laporan_Verifikasi_${mediaRecord.jenis}_${mediaRecord.nama_media}.pdf`)
  }

  static _buildRekapitulasi(mediaList) {
    if (!mediaList || mediaList.length === 0) {
      throw new Error('Tidak ada data media untuk diekspor.')
    }

    const builder = new PdfDocumentBuilder({
      orientation: 'portrait'
    })

    PersetujuanTemplate.buildDocument(builder, mediaList, documentSettings)
    return builder
  }

  static previewRekapitulasi(mediaList) {
    const builder = this._buildRekapitulasi(mediaList)
    const dateStr = new Date().toISOString().split('T')[0]
    return {
      blobUrl: builder.getBlobUrl(),
      filename: `Rekapitulasi_Persetujuan_${dateStr}.pdf`
    }
  }

  static downloadRekapitulasi(mediaList) {
    const builder = this._buildRekapitulasi(mediaList)
    const dateStr = new Date().toISOString().split('T')[0]
    builder.save(`Rekapitulasi_Persetujuan_${dateStr}.pdf`)
  }
}

export default PdfExportService
