/* eslint-disable no-restricted-globals */

self.onmessage = async (event) => {
  // Accept either `arrayBuffer` (preferred) or `buffer` (fallback)
  const { arrayBuffer, buffer, type } = event.data
  const inputBuffer = arrayBuffer ?? buffer

  try {
    // Create Blob from received buffer (either `arrayBuffer` or `buffer`)
    const blob = new Blob([inputBuffer], { type: type || 'image/jpeg' })
    
    // Create ImageBitmap from Blob
    const bitmap = await createImageBitmap(blob)
    const maxSize = 800
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, width, height)

    const compressedBlob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: 0.75,
    })

    // Blob is not a transferable in all browsers — send via structured clone
    self.postMessage({ success: true, blob: compressedBlob })
  } catch (error) {
    self.postMessage({ success: false, error: error.message })
  }
}

