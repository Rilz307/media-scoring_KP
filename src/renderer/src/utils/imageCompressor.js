/**
 * Downscale and compress an image file (JPEG/PNG) in the browser/renderer process.
 * Max width/height is 1600px. Output format is always image/jpeg with 80% quality.
 *
 * @param {File} file - HTML5 File object from input.
 * @returns {Promise<Uint8Array>} Raw compressed image binary buffer.
 */
export function compressImageToBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        const MAX_DIM = 1600
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width)
            width = MAX_DIM
          } else {
            width = Math.round((width * MAX_DIM) / height)
            height = MAX_DIM
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const exportMimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const exportQuality = exportMimeType === 'image/jpeg' ? 0.8 : undefined

        // Compress image maintaining aspect ratio and formats
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas blob compression failed.'))
            }
            const blobReader = new FileReader()
            blobReader.onload = () => {
              const arrayBuffer = blobReader.result
              resolve(new Uint8Array(arrayBuffer))
            }
            blobReader.onerror = (e) => reject(e)
            blobReader.readAsArrayBuffer(blob)
          },
          exportMimeType,
          exportQuality
        )
      }
      img.onerror = (e) => reject(e)
      img.src = event.target.result
    }
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}
