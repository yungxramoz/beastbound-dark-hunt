import { STYLE } from '../constants/style.js'
import { addBorder, drawRect, drawWrappedText } from './ui.js'
import Button from './button.js'

class Dialog {
  /**
   * The base class for all dialogs.
   * @param {Game} game - The game instance.
   * @param {Object} options - The options for the Dialog component.
   * @param {function} [options.onClose] - The function to call when the dialog is closed.
   * @param {number} [options.dialogHeight] - The height of the dialog.
   * @param {number} [options.dialogWidth] - The width of the dialog.
   * @param {number} [options.dialogX] - The x position of the dialog.
   * @param {number} [options.dialogY] - The y position of the dialog.
   * @param {Array} [options.buttons] - The buttons to display on the dialog.
   * @param {boolean} [options.overlay] - Whether to display an overlay.
   * @param {string} [options.overlayColor] - The color of the overlay.
   */
  constructor(
    game,
    {
      title,
      onClose,
      dialogHeight,
      dialogWidth,
      dialogX,
      dialogY,
      buttons,
      overlay,
      overlayColor,
    } = {},
  ) {
    this.game = game
    this.onClose = onClose

    // Default to center of the screen
    this.dialogWidth = dialogWidth || this.game.canvas.width / 2
    this.dialogHeight = dialogHeight || this.game.canvas.height / 2
    this.dialogX = dialogX || (this.game.canvas.width - this.dialogWidth) / 2
    this.dialogY = dialogY || (this.game.canvas.height - this.dialogHeight) / 2

    if (title) {
      this.title = title
    }

    this.buttons = []
    if (buttons) {
      this.setupButtons(buttons)
    }

    this.overlay = {
      enabled: overlay !== undefined ? overlay : true,
      color: overlayColor || 'rgba(0, 0, 0, 0.5)',
    }
  }

  /**
   * Sets up the buttons for the dialog.
   * @param {Array} buttonOptionsArray - The options for the buttons.
   * @param {number} buttonOptionsArray.x - The x position of the button.
   * @param {number} buttonOptionsArray.y - The y position of the button.
   * @param {number} buttonOptionsArray.width - The width of the button.
   * @param {number} buttonOptionsArray.height - The height of the button.
   * @param {string} buttonOptionsArray.text - The text of the button.
   * @param {function} buttonOptionsArray.onClick - The function to call when the button is clicked.
   */
  setupButtons(buttonOptionsArray) {
    let buttonOffsetY = 0
    if (this.title) {
      buttonOffsetY = 20
    }

    for (const buttonOptions of buttonOptionsArray) {
      const x =
        buttonOptions.x ||
        this.dialogWidth / 2 + this.dialogX - buttonOptions.width / 2
      const y =
        buttonOptions.y ||
        this.dialogY +
          this.dialogHeight / 2 -
          buttonOptions.height / 2 +
          buttonOffsetY

      const button = new Button(this.game, { x, y, ...buttonOptions })
      this.buttons.push(button)
      buttonOffsetY += buttonOptions.height + 20
    }
  }

  /**
   * Closes the dialog.
   */
  close() {
    this.game.dialogManager.closeDialog(this)
    if (this.onClose) {
      this.onClose()
    }
  }

  update(deltaTime) {
    for (const button of this.buttons) {
      button.update(deltaTime)
    }
  }

  draw(ctx) {
    if (this.overlay.enabled) {
      drawRect(
        ctx,
        0,
        0,
        this.game.canvas.width,
        this.game.canvas.height,
        this.overlay.color,
      )
    }

    drawRect(
      ctx,
      this.dialogX,
      this.dialogY,
      this.dialogWidth,
      this.dialogHeight,
      STYLE.COLORS.BACKGROUND,
    )

    addBorder(
      ctx,
      this.dialogX,
      this.dialogY,
      this.dialogWidth,
      this.dialogHeight,
    )

    if (this.title) {
      drawWrappedText(
        ctx,
        this.title,
        this.dialogWidth / 2 + this.dialogX,
        this.dialogY + 40,
        this.dialogWidth - 40,
        20,
        {
          align: 'center',
          size: STYLE.FONT_SIZE.LARGE,
        },
      )
    }

    for (const button of this.buttons) {
      button.draw(ctx)
    }
  }
}

export default Dialog
