import { PDF_CONFIG } from '../constants/pdfConfig'
import normalizeReport from '../../utils/ReportBuilder'
import mediaCriteria from '../../constants/mediaCriteria'

class PersetujuanTemplate {
  static buildDocument(builder, rawMediaList) {
    // 1. Draw Title
    builder.drawCenteredText('LAMPIRAN HASIL VERIFIKASI MEDIA', PDF_CONFIG.SIZES.H1, true)
    builder.addSpace(2)

    // Optional: Tanggal Verifikasi
    const dateStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    builder.drawCenteredText(`Tanggal Verifikasi: ${dateStr}`, PDF_CONFIG.SIZES.BODY, false)
    builder.addSpace(10)

    // 2. Normalize and Group Data
    const normalized = rawMediaList.map((m) => normalizeReport(m, mediaCriteria))

    const groups = {
      ELEKTRONIK: normalized.filter((m) => m.jenis === 'ELEKTRONIK'),
      CETAK: normalized.filter((m) => m.jenis === 'CETAK'),
      SIBER: normalized.filter((m) => m.jenis === 'SIBER')
    }

    const headers = ['NO', 'NAMA MEDIA', 'NAMA PERUSAHAAN', 'ALAMAT', 'KRITERIA POINT', 'KET']
    const bodyRows = []

    const addGroup = (groupLabel, letter, items) => {
      // Add category row spanning full width
      bodyRows.push([
        { content: letter, styles: { halign: 'center', fontStyle: 'bold' } },
        { content: groupLabel, colSpan: 5, styles: { fontStyle: 'bold' } }
      ])

      items.forEach((item, idx) => {
        const pointText = `${item.totalScore} Poin`
        // We use grade presence as a generic check. The exact business rules can be expanded.
        const ket = item.grade ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat'

        bodyRows.push([
          { content: (idx + 1).toString(), styles: { halign: 'center' } },
          { content: item.nama_media || '-' },
          { content: item.perusahaan || '-' },
          { content: item.alamat || '-' },
          { content: pointText, styles: { halign: 'center' } },
          { content: ket, styles: { halign: 'center' } }
        ])
      })
    }

    addGroup('MEDIA ELEKTRONIK', 'A', groups.ELEKTRONIK)
    addGroup('MEDIA CETAK', 'B', groups.CETAK)
    addGroup('MEDIA CIBER/ONLINE', 'C', groups.SIBER)

    // Draw the table
    const customColumnStyles = {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 'auto' }, // flexible for Alamat
      4: { cellWidth: 22 },
      5: { cellWidth: 28 }
    }
    builder.drawTable(headers, bodyRows, customColumnStyles, 15) // small bottom margin

    // 4. Draw Final Results Summary (Total items processed)
    builder.addSpace(10)
    builder.drawTextBlock('Ringkasan Hasil Verifikasi:', 'left', true)

    const totalMemenuhi = normalized.filter((m) => m.grade).length
    const totalTidakMemenuhi = normalized.filter((m) => !m.grade).length

    builder.drawTextBlock(
      [
        `Total Media Dievaluasi: ${normalized.length}`,
        `Memenuhi Syarat: ${totalMemenuhi}`,
        `Tidak Memenuhi Syarat: ${totalTidakMemenuhi}`
      ],
      'left',
      false
    )
  }
}

export default PersetujuanTemplate
