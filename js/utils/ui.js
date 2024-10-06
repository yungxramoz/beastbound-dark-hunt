import { STYLE } from '../constants/style.js'

export const addBorder = (ctx, x, y, width, height, colorOptions = {}) => {
  let highlight = colorOptions.highlight || STYLE.COLORS.PRIMARY_LIGHTER_1
  let shadow = colorOptions.shadow || STYLE.COLORS.PRIMARY_DARKER_1
  let border = colorOptions.border || STYLE.COLORS.PRIMARY_DARKER_3

  // Dialog border
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
}

export const drawText = (ctx, text, x, y, options = {}) => {
  const color = options.color || STYLE.COLORS.TEXT_LIGHT
  const size = options.size || STYLE.FONT_SIZE.MEDIUM
  const font = options.font || STYLE.FONT
  const align = options.align || 'left'
  const shadow = options.shadow || true
  const baseline = options.baseline || 'top'

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

  // Reset styles
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
}

export const drawWrappedText = (
  ctx,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  options = {},
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
  drawText(ctx, line, x, y, options)
}

export const drawRect = (ctx, x, y, width, height, color) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, width, height)
}

export const drawImage = (ctx, image, x, y, width, height) => {
  ctx.drawImage(image, x, y, width, height)
}

export const resetStyles = (ctx) => {
  ctx.shadowColor = 'transparent'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.shadowBlur = 0
  ctx.lineWidth = 1
  ctx.textBaseline = 'top'
}
