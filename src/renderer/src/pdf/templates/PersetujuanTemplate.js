import { PDF_CONFIG } from '../constants/pdfConfig'
import normalizeReport from '../../utils/ReportBuilder'
import mediaCriteria from '../../constants/mediaCriteria'

class PersetujuanTemplate {
  static buildDocument(builder, rawMediaList, settings) {
    // 1. Draw Preamble
    builder.drawCenteredText(settings.government.region, PDF_CONFIG.SIZES.H1, true)
    builder.drawCenteredText(settings.government.department, PDF_CONFIG.SIZES.H1, true)
    builder.drawCenteredText(settings.government.address, PDF_CONFIG.SIZES.BODY, false)
    builder.drawHorizontalLine()

    builder.drawCenteredText(settings.decree.title, PDF_CONFIG.SIZES.H1, true)
    builder.addSpace(6)

    builder.drawTextBlock(
      [settings.decree.reference, '', 'Yang bertanda tangan di bawah ini:'],
      'justify'
    )

    // 2. Draw Verifiers List
    const vText = []
    settings.verifiers.forEach((v) => {
      vText.push(`Nama         : ${v.name}`)
      vText.push(`Jabatan      : ${v.title}`)
      vText.push(`Instansi     : ${settings.government.department}`)
      vText.push('') // empty line separator
    })
    builder.drawTextBlock(vText)

    builder.drawTextBlock(settings.decree.opening)
    builder.addSpace(6)

    // 3. Normalize and Group Data
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

    // Draw the table — reserve signature zone at bottom so table cannot push into signatures
    const customColumnStyles = {
      0: { cellWidth: 10 },
      1: { cellWidth: 35 },
      2: { cellWidth: 40 },
      3: { cellWidth: 'auto' }, // flexible for Alamat
      4: { cellWidth: 22 },
      5: { cellWidth: 28 }
    }
    builder.drawTable(headers, bodyRows, customColumnStyles, builder.SIGNATURE_RESERVED_HEIGHT)

    // 4. Draw Closing
    builder.drawTextBlock(settings.decree.closing, 'justify')
    builder.addSpace(10)

    // 5. Draw Signatures
    const sigGrid = settings.verifiers.map((v) => ({
      topLabel: v.title,
      name: v.name,
      position: v.position || ''
    }))

    // Calculate dynamic page-break for the ENTIRE signature block using actual computed heights
    const exactGridHeight = builder.calculateSignatureGridHeight(sigGrid, 3)
    const exactApprovalHeight = builder.calculateApprovalBlockHeight(settings.head)
    const spacingHeight = 15
    const totalNeeded = exactGridHeight + spacingHeight + exactApprovalHeight

    // Anchor the ENTIRE signature section flush to the bottom of the last page.
    // pushToBottom() handles: (a) new page if needed, (b) exact bottom anchor.
    builder.pushToBottom(totalNeeded)

    // Draw verifiers grid — no ensureSpace inside, pushToBottom owns the guarantee
    builder.drawSignatureGrid(sigGrid, 3)

    // Approval block follows immediately below the grid (cursorY already correct after grid)
    builder.drawRightAlignedApprovalBlock(settings.head)
  }
}

export default PersetujuanTemplate
