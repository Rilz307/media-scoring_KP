export default class HtmlPdfRenderer {
  /**
   * Replaces mustache-like placeholders {{key}} with values from viewModel
   */
  static renderToHtml(templateHtml, viewModel) {
    let result = templateHtml
    for (const key in viewModel) {
      // Use replaceAll or a global regex to replace all occurrences
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(
        regex,
        viewModel[key] === null || viewModel[key] === undefined ? '' : viewModel[key]
      )
    }
    return result
  }

  /**
   * Calls the Main Process IPC to print the HTML string to a PDF buffer
   */
  static async printToPdfBuffer(htmlString) {
    if (!window.api?.pdf?.printHtml) {
      throw new Error('PDF IPC API not available')
    }
    const buffer = await window.api.pdf.printHtml(htmlString)
    return buffer
  }
}
