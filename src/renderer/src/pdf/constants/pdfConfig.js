export const PDF_CONFIG = {
  FONTS: {
    PRIMARY: 'bookman',
    STYLE_NORMAL: 'normal',
    STYLE_BOLD: 'bold',
    STYLE_ITALIC: 'italic'
  },
  SIZES: {
    H1: 11,
    H2: 11,
    BODY: 11,
    SMALL: 8
  },
  MARGINS: {
    TOP: 25.4,
    BOTTOM: 25.4,
    LEFT: 25.4,
    RIGHT: 25.4
  },
  THEME: {
    TABLE_HEADER_BG: [255, 255, 255],
    TABLE_BORDER: [0, 0, 0],
    TEXT_MAIN: [0, 0, 0],
    LINE_WIDTH: 0.1
  },
  SYMBOLS: {
    CHECKED: 'V', // Will fall back to simpler strings or custom glyphs if JS auto-table doesn't support unicode boxes nicely, but let's try standard strings.
    UNCHECKED: ''
  }
}
