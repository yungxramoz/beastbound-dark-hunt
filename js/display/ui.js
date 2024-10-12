import { STYLE } from '../constants/style.js'

/**
 * Adds a border to a rectangle.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @param {Object} options - The options for the border.
 * @param {string} options.highlight - The color of the highlight.
 * @param {string} options.shadow - The color of the shadow.
 * @param {string} options.border - The color of the border.
 */
export const addBorder = (
  ctx,
  x,
  y,
  width,
  height,
  { highlight, shadow, border } = {},
) => {
  highlight = highlight || STYLE.COLORS.PRIMARY_LIGHTER_1
  shadow = shadow || STYLE.COLORS.PRIMARY_DARKER_1
  border = border || STYLE.COLORS.PRIMARY_DARKER_3

  // Border
  ctx.strokeStyle = border
  ctx.lineWidth = STYLE.BORDER.WIDTH
  const borderOffset = STYLE.BORDER.WIDTH / 2
  ctx.beginPath()
  ctx.moveTo(x - borderOffset, y)
  ctx.lineTo(x - borderOffset, y + height)
  ctx.moveTo(x + width + borderOffset, y)
  ctx.lineTo(x + width + borderOffset, y + height)
  ctx.moveTo(x, y + height + borderOffset)
  ctx.lineTo(x + width, y + height + borderOffset)
  ctx.moveTo(x, y - borderOffset)
  ctx.lineTo(x + width, y - borderOffset)
  ctx.stroke()

  // light border on top and left
  ctx.strokeStyle = highlight
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + width, y)
  ctx.moveTo(x, y)
  ctx.lineTo(x, y + height)
  ctx.stroke()

  // dark border on bottom and right
  ctx.strokeStyle = shadow
  ctx.beginPath()
  ctx.moveTo(x + width, y + height)
  ctx.lineTo(x, y + height)
  ctx.moveTo(x + width, y + height)
  ctx.lineTo(x + width, y)
  ctx.stroke()

  // Reset styles
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.lineWidth = 1

  resetStyles(ctx)
}

/**
 * Draws text on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 * @param {string} text - The text to draw.
 * @param {number} x - The x-coordinate of the text.
 * @param {number} y - The y-coordinate of the text.
 * @param {Object} options - The options for the text.
 * @param {string} options.color - The color of the text.
 * @param {number} options.size - The size of the text.
 * @param {string} options.font - The font of the text.
 * @param {string} options.align - The alignment of the text.
 * @param {boolean} options.shadow - Add shadow to the text.
 * @param {string} options.baseline - The baseline of the text.
 */
export const drawText = (
  ctx,
  text,
  x,
  y,
  { color, size, font, align, shadow, baseline } = {},
) => {
  color = color || STYLE.COLORS.TEXT_LIGHT
  size = size || STYLE.FONT_SIZE.MEDIUM
  font = font || STYLE.FONT
  align = align || 'left'
  shadow = shadow || true
  baseline = baseline || 'top'

  ctx.fillStyle = color
  ctx.font = `${size}px ${font}`
  ctx.textAlign = align
  ctx.textBaseline = baseline

  if (shadow) {
    ctx.shadowColor = STYLE.COLORS.SHADOW_LIGHT
    ctx.shadowOffsetX = STYLE.FONT_SHADOW.OFFSET_X
    ctx.shadowOffsetY = STYLE.FONT_SHADOW.OFFSET_Y
  }

  ctx.fillText(text, x, y)

  resetStyles(ctx)
}

/**
 * Draws wrapped text on the canvas with a maximum width.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 * @param {string} text - The text to draw.
 * @param {number} x - The x-coordinate of the text.
 * @param {number} y - The y-coordinate of the text.
 * @param {number} maxWidth - The maximum width of the text.
 * @param {number} lineHeight - The line height of the text.
 * @param {Object} options - The options for the text.
 * @param {string} options.color - The color of the text.
 * @param {number} options.size - The size of the text.
 * @param {string} options.font - The font of the text.
 * @param {string} options.align - The alignment of the text.
 * @param {boolean} options.shadow - Add shadow to the text.
 * @param {string} options.baseline - The baseline of the text.
 */
export const drawWrappedText = (
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  { color, size, font, align, shadow, baseline } = {},
) => {
  const words = text.split(' ')
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' '
    const metrics = ctx.measureText(testLine)
    const testWidth = metrics.width
    if (testWidth > maxWidth && n > 0) {
      drawText(ctx, line, x, y)
      line = words[n] + ' '
      y += lineHeight
    } else {
      line = testLine
    }
  }
  drawText(ctx, line, x, y, { color, size, font, align, shadow, baseline })
}

/**
 * Draws a rectangle on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */
export const drawRect = (ctx, x, y, width, height, color) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
  resetStyles(ctx)
}

/**
 * Draws an image on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 * @param {HTMLImageElement} image - The image to draw.
 * @param {number} x - The x-coordinate of the image.
 * @param {number} y - The y-coordinate of the image.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 */
export const drawImage = (ctx, image, x, y, width, height) => {
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(image, x, y, width, height)
  resetStyles(ctx)
}

/**
 * Draws a line on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas 2d context.
 */
export const resetStyles = (ctx) => {
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
}
