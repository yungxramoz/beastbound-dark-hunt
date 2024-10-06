import { STYLE } from '../constants/style.js'
import { addBorder, drawRect, drawText, resetStyles } from '../utils/ui.js'

// button.js
export class Button {
  constructor(game, options) {
    this.game = game
    this.x = options.x || 0
    this.y = options.y || 0
    this.width = options.width || 150
    this.height = options.height || 40
    this.text = options.text || 'Button'
    this.onClick = options.onClick || function () {}
    this.isHovered = false
    this.isPressed = false
  }

  update(deltaTime) {
    const pointer = this.game.mouse

    // Check if the pointer is over the button
    const overButton =
      pointer.x >= this.x &&
      pointer.x <= this.x + this.width &&
      pointer.y >= this.y &&
      pointer.y <= this.y + this.height

    if (overButton) {
      this.isHovered = true

      // Change cursor style to pointer when hovering over the button
      if (this.game.canvas.style.cursor !== STYLE.CURSOR.POINTER) {
        this.game.canvas.style.cursor = STYLE.CURSOR.POINTER
      }

      if (pointer.isPressed) {
        if (!this.isPressed) {
          this.isPressed = true
        }
      } else {
        if (this.isPressed) {
          this.isPressed = false
          // Trigger the click event
          this.onClick()
          this.game.canvas.style.cursor = STYLE.CURSOR.DEFAULT
        }
      }
    } else {
      this.isHovered = false
    }

    if (
      !this.isHovered &&
      this.game.canvas.style.cursor === STYLE.CURSOR.POINTER
    ) {
      this.game.canvas.style.cursor = STYLE.CURSOR.DEFAULT
    }
  }

  draw(ctx) {
    // Draw button background
    let fillStyle = STYLE.COLORS.SECONDARY
    if (this.isPressed) {
      fillStyle = STYLE.COLORS.SECONDARY_DARKER_2
    } else if (this.isHovered) {
      fillStyle = STYLE.COLORS.SECONDARY_LIGHTER_2
    }

    drawRect(ctx, this.x, this.y, this.width, this.height, fillStyle)

    addBorder(ctx, this.x, this.y, this.width, this.height, {
      highlight: STYLE.COLORS.SECONDARY_LIGHTER_1,
      shadow: STYLE.COLORS.SECONDARY_DARKER_3,
    })

    drawText(
      ctx,
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      {
        align: 'center',
        baseline: 'middle',
      },
    )

    // Reset styles
    resetStyles(ctx)
  }
}
