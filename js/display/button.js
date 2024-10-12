import { STYLE } from '../constants/style.js'
import { addBorder, drawRect, drawText } from './ui.js'

class Button {
  /**
   * A button component
   * @param {Game} game - The game instance.
   * @param {Object} options - The options for the Button component.
   * @param {number} options.x - The x position of the button.
   * @param {number} options.y - The y position of the button.
   * @param {number} options.width - The width of the button.
   * @param {number} options.height - The height of the button.
   * @param {string} options.text - The text of the button.
   * @param {function} options.onClick - The function to call when the button is clicked.
   */
  constructor(game, { x, y, width, height, text, onClick } = {}) {
    this.game = game
    this.x = x || 0
    this.y = y || 0
    this.width = width || 150
    this.height = height || 40
    this.text = text || 'Button'
    this.onClick = onClick || function () {}
    this.isHovered = false
    this.isPressed = false
  }

  update(deltaTime) {
    const pointer = this.game.pointer

    // Check if the pointer is over the button
    const overButton =
      pointer.x >= this.x &&
      pointer.x <= this.x + this.width &&
      pointer.y >= this.y &&
      pointer.y <= this.y + this.height

    if (overButton) {
      this.isHovered = true

      if (pointer.isDown) {
        if (!this.isDown) {
          this.isDown = true
        }
      } else {
        //only trigger click if the pointer was pressed and released over the button
        if (this.isDown) {
          this.isDown = false
          this.onClick()
        }
      }
    } else {
      this.isHovered = false
    }
  }

  draw(ctx) {
    let fillStyle = STYLE.COLORS.SECONDARY
    if (this.isDown) {
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
  }
}

export default Button
