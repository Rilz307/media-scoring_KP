import jsPDF from 'jspdf'
import { autoTable } from 'jspdf-autotable'
import { PDF_CONFIG } from '../constants/pdfConfig'
import { bookmanBase64 } from '../fonts/BookmanOldStyle'

/**
 * Pure drawing layer. Translates primitive drawing instructions (rows, widths, texts)
 * into a jsPDF document. Contains NO business logic and NO media-specific knowledge.
 */
class PdfDocumentBuilder {
  constructor(options = {}) {
    this.format = options.format || [215.9, 330.0] // Default F4 for normal forms
    this.margins = options.margins || PDF_CONFIG.MARGINS

    // Initialize jsPDF with specified format
    this.doc = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: this.format
    })

    // Load Bookman Old Style font via VFS
    this.doc.addFileToVFS('bookman.ttf', bookmanBase64)
    this.doc.addFont('bookman.ttf', 'bookman', 'normal')
    this.doc.addFont('bookman.ttf', 'bookman', 'bold') // Using same font for bold fallback if strictly needed

    this.cursorY = this.margins.TOP

    /**
     * Signature reserved zone height (mm).
     * The table will stop this many mm before page bottom to protect the signature area.
     */
    this.SIGNATURE_RESERVED_HEIGHT = 80
  }

  ensureSpace(neededHeight) {
    if (this.cursorY > this.doc.internal.pageSize.height - this.margins.BOTTOM - neededHeight) {
      this.doc.addPage()
      this.cursorY = this.margins.TOP
    }
  }

  /**
   * Jumps to the very last page and anchors cursorY so that a block
   * of `neededHeight` mm fits exactly flush against the bottom margin.
   * If the current content won't fit, a new page is added first.
   */
  pushToBottom(neededHeight) {
    const pageHeight = this.doc.internal.pageSize.height
    const availableOnCurrentPage = pageHeight - this.margins.BOTTOM - this.cursorY

    if (availableOnCurrentPage < neededHeight) {
      this.doc.addPage()
      this.cursorY = this.margins.TOP
    }

    // Anchor: place cursorY so the block ends exactly at bottom margin
    const pageBottom = this.doc.internal.pageSize.height - this.margins.BOTTOM
    this.cursorY = pageBottom - neededHeight
  }

  addSpace(spaceAmount) {
    this.cursorY += spaceAmount
  }

  /**
   * Draws centered text (used for headers and titles)
   */
  drawCenteredText(text, fontSize = PDF_CONFIG.SIZES.H1, isBold = true) {
    this.doc.setFontSize(fontSize)
    this.doc.setFont(
      PDF_CONFIG.FONTS.PRIMARY,
      isBold ? PDF_CONFIG.FONTS.STYLE_BOLD : PDF_CONFIG.FONTS.STYLE_NORMAL
    )
    const pageWidth = this.doc.internal.pageSize.width
    this.doc.text(text, pageWidth / 2, this.cursorY, { align: 'center' })
    this.cursorY += 6
  }

  /**
   * Draws a horizontal line across the page
   */
  drawHorizontalLine(thickness = 0.5) {
    const pageWidth = this.doc.internal.pageSize.width
    this.doc.setLineWidth(thickness)
    this.doc.line(this.margins.LEFT, this.cursorY, pageWidth - this.margins.RIGHT, this.cursorY)
    this.cursorY += 10
  }

  /**
   * Draws the standard company letterhead header for individual media assessment sheets.
   */
  drawCompanyHeader(mediaName, perusahaan) {
    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_BOLD)
    this.doc.setFontSize(PDF_CONFIG.SIZES.H1)

    // "KOP SURAT PERUSAHAAN"
    this.doc.text('KOP SURAT PERUSAHAAN', this.margins.LEFT, this.cursorY)
    this.cursorY += 10

    // "NAMA MEDIA : ..."
    this.doc.setFontSize(PDF_CONFIG.SIZES.H2)
    this.doc.text(
      `NAMA MEDIA : ${mediaName || '..................'}`,
      this.margins.LEFT,
      this.cursorY
    )
    this.cursorY += 6

    // "PERUSAHAAN : ..."
    this.doc.text(
      `PERUSAHAAN  : ${perusahaan || '..................'}`,
      this.margins.LEFT,
      this.cursorY
    )
    this.cursorY += 10
  }

  /**
   * Draws text block (for subtitles, declarations, etc.)
   */
  drawTextBlock(text, align = 'left', isBold = false) {
    this.doc.setFont(
      PDF_CONFIG.FONTS.PRIMARY,
      isBold ? PDF_CONFIG.FONTS.STYLE_BOLD : PDF_CONFIG.FONTS.STYLE_NORMAL
    )
    this.doc.setFontSize(PDF_CONFIG.SIZES.BODY)

    const pageWidth = this.doc.internal.pageSize.width
    const contentWidth = pageWidth - this.margins.LEFT - this.margins.RIGHT

    // Handle array of strings or single string
    const lines = Array.isArray(text) ? text : [text]

    lines.forEach((line) => {
      if (align === 'justify') {
        const splitLines = this.doc.splitTextToSize(line, contentWidth)
        this.doc.text(splitLines, this.margins.LEFT, this.cursorY, {
          align: 'justify',
          maxWidth: contentWidth
        })
        this.cursorY += splitLines.length * 6
      } else if (align === 'center') {
        this.doc.text(line, pageWidth / 2, this.cursorY, { align: 'center' })
        this.cursorY += 6
      } else {
        this.doc.text(line, this.margins.LEFT, this.cursorY)
        this.cursorY += 6
      }
    })
    this.cursorY += 2 // extra padding after block
  }

  /**
   * Draws a highly formal, bordered table matching the DOCX design.
   * Auto handles pagination and rowSpans.
   * @param {number} reservedBottomMm - mm to reserve above page bottom (protects signature zone).
   */
  drawTable(headers, bodyRows, customColumnStyles = {}, reservedBottomMm = 0) {
    const effectiveMarginBottom = this.margins.BOTTOM + reservedBottomMm
    autoTable(this.doc, {
      startY: this.cursorY,
      head: [headers],
      body: bodyRows,
      theme: 'grid',
      styles: {
        font: PDF_CONFIG.FONTS.PRIMARY,
        fontSize: PDF_CONFIG.SIZES.BODY,
        textColor: PDF_CONFIG.THEME.TEXT_MAIN,
        lineColor: PDF_CONFIG.THEME.TABLE_BORDER,
        lineWidth: PDF_CONFIG.THEME.LINE_WIDTH,
        cellPadding: 2,
        valign: 'middle'
      },
      headStyles: {
        fillColor: PDF_CONFIG.THEME.TABLE_HEADER_BG,
        textColor: PDF_CONFIG.THEME.TEXT_MAIN,
        fontStyle: PDF_CONFIG.FONTS.STYLE_BOLD,
        halign: 'center'
      },
      columnStyles: customColumnStyles,
      margin: {
        left: this.margins.LEFT,
        right: this.margins.RIGHT,
        bottom: effectiveMarginBottom
      }
    })

    this.cursorY = this.doc.lastAutoTable.finalY + 10
  }

  /**
   * Draws a grid of signatures (useful for Tim Verifikator).
   * MUST be called AFTER pushToBottom() — does NOT call ensureSpace internally.
   * signatures: Array of objects { topLabel, title, name, position, nip }
   */
  drawSignatureGrid(signatures, columns = 3) {
    const pageWidth = this.doc.internal.pageSize.width
    const contentWidth = pageWidth - this.margins.LEFT - this.margins.RIGHT
    const colWidth = contentWidth / columns
    const maxTextWidth = colWidth - 10 // 5mm padding on each side

    // Set font state BEFORE iterating so splitTextToSize is accurate
    this.doc.setFontSize(PDF_CONFIG.SIZES.BODY)

    for (let i = 0; i < signatures.length; i += columns) {
      // NO ensureSpace here — pushToBottom() owns this guarantee
      const rowSignatures = signatures.slice(i, i + columns)
      const startY = this.cursorY
      let maxY = startY

      rowSignatures.forEach((sig, index) => {
        if (!sig) return

        const xPos = this.margins.LEFT + index * colWidth + colWidth / 2
        let yPos = startY

        const drawWrappedText = (text, isBold = false, extraSpaceAfter = 0) => {
          if (!text) return
          this.doc.setFont(
            PDF_CONFIG.FONTS.PRIMARY,
            isBold ? PDF_CONFIG.FONTS.STYLE_BOLD : PDF_CONFIG.FONTS.STYLE_NORMAL
          )
          const lines = this.doc.splitTextToSize(text, maxTextWidth)
          lines.forEach((line) => {
            this.doc.text(line, xPos, yPos, { align: 'center' })
            yPos += 5
          })
          yPos += extraSpaceAfter
        }

        drawWrappedText(sig.topLabel, false, 4)
        drawWrappedText(sig.title, false, 22) // space for handwritten signature
        drawWrappedText(sig.name, true, 4)
        drawWrappedText(sig.position, false, 4)
        drawWrappedText(sig.nip, false, 0)

        if (yPos > maxY) maxY = yPos
      })

      this.cursorY = maxY + 8
    }
  }

  /**
   * Calculates the exact height required for the signature grid.
   * MUST use the same font state as drawSignatureGrid.
   */
  calculateSignatureGridHeight(signatures, columns = 3) {
    const pageWidth = this.doc.internal.pageSize.width
    const contentWidth = pageWidth - this.margins.LEFT - this.margins.RIGHT
    const colWidth = contentWidth / columns
    const maxTextWidth = colWidth - 10

    // Set font state to match drawSignatureGrid exactly
    this.doc.setFontSize(PDF_CONFIG.SIZES.BODY)
    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_NORMAL)

    let totalHeight = 0
    for (let i = 0; i < signatures.length; i += columns) {
      const rowSignatures = signatures.slice(i, i + columns)
      let maxRowHeight = 0

      rowSignatures.forEach((sig) => {
        if (!sig) return
        let cellHeight = 0

        const simulate = (text, extraSpaceAfter = 0) => {
          if (!text) return
          const lines = this.doc.splitTextToSize(text, maxTextWidth)
          cellHeight += lines.length * 5
          cellHeight += extraSpaceAfter
        }

        simulate(sig.topLabel, 4)
        simulate(sig.title, 22)
        simulate(sig.name, 4)
        simulate(sig.position, 4)
        simulate(sig.nip, 0)

        if (cellHeight > maxRowHeight) maxRowHeight = cellHeight
      })
      totalHeight += maxRowHeight + 8
    }
    return totalHeight
  }

  /**
   * Calculates the exact height required for the approval block
   */
  calculateApprovalBlockHeight(config) {
    let height = 0
    height += 6 // Kendari, Date
    height += 6 // MENGETAHUI

    if (config.title) {
      const titleLines = this.doc.splitTextToSize(config.title, 80)
      height += titleLines.length * 6
    }
    height += 25 // physical signature space

    if (config.name) height += 6
    if (config.rank) height += 6
    if (config.nip) height += 6

    return height + 5 // bottom padding
  }

  /**
   * Draws a standard right-aligned Indonesian government approval block.
   * MUST be called AFTER pushToBottom() — does NOT call ensureSpace internally.
   * cursorY is used as the draw start point (set by pushToBottom + drawSignatureGrid).
   */
  drawRightAlignedApprovalBlock(config, dateString = '........................ 2025') {
    // NO ensureSpace here — caller (PersetujuanTemplate) owns this via pushToBottom
    const rightMarginX = this.doc.internal.pageSize.getWidth() - this.margins.RIGHT
    let y = this.cursorY

    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_NORMAL)
    this.doc.setFontSize(PDF_CONFIG.SIZES.BODY)

    this.doc.text(`Kendari, ${dateString}`, rightMarginX, y, { align: 'right' })
    y += 6

    this.doc.text('MENGETAHUI,', rightMarginX, y, { align: 'right' })
    y += 6

    if (config.title) {
      const titleLines = this.doc.splitTextToSize(config.title, 80)
      titleLines.forEach((line) => {
        this.doc.text(line, rightMarginX, y, { align: 'right' })
        y += 6
      })
    }

    y += 25 // space for handwritten signature

    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_BOLD)
    if (config.name) {
      this.doc.text(`(${config.name})`, rightMarginX, y, { align: 'right' })
      y += 6
    }

    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_NORMAL)
    if (config.rank) {
      this.doc.text(config.rank, rightMarginX, y, { align: 'right' })
      y += 6
    }

    if (config.nip) {
      this.doc.text(config.nip, rightMarginX, y, { align: 'right' })
      y += 6
    }

    this.cursorY = y + 5
  }

  /**
   * Draws the standard company declaration and signature block.
   */
  drawCompanyDeclarationAndSignature(companyName) {
    this.ensureSpace(60)

    const pageWidth = this.doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - this.margins.LEFT - this.margins.RIGHT

    const declaration =
      'Demikian Formulir isian ini Saya buat dengan sesungguhnya diatas materai yang cukup dan kebenaran isi merupakan tanggung jawab Saya sebagai pimpinan Perusahaan.'

    const splitDeclaration = this.doc.splitTextToSize(declaration, contentWidth)
    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_NORMAL)
    this.doc.setFontSize(PDF_CONFIG.SIZES.BODY)
    this.doc.text(splitDeclaration, this.margins.LEFT, this.cursorY, {
      align: 'justify',
      maxWidth: contentWidth
    })

    this.cursorY += splitDeclaration.length * 6 + 10

    const rightMarginX = pageWidth - this.margins.RIGHT
    let y = this.cursorY

    this.doc.text('Kendari, ........................ 2025', rightMarginX, y, { align: 'right' })

    y += 7
    this.doc.text('Pimpinan Perusahaan', rightMarginX, y, { align: 'right' })

    y += 25
    this.doc.setFont(PDF_CONFIG.FONTS.PRIMARY, PDF_CONFIG.FONTS.STYLE_BOLD)

    const displayCompany = companyName ? companyName : '........................'
    this.doc.text(`(${displayCompany})`, rightMarginX, y, { align: 'right' })

    this.cursorY = y + 15
  }

  getBlobUrl() {
    const blob = this.doc.output('blob')
    return URL.createObjectURL(blob)
  }

  save(filename) {
    this.doc.save(filename)
  }
}

export default PdfDocumentBuilder
