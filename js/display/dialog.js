import { STYLE } from '../constants/style.js'
import { addBorder, drawRect } from './ui.js'
import Button from './button.js'

class Dialog {
  constructor(
    game,
    {
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

    this.buttons = []
    if (buttons) {
      this.setupButtons(buttons)
    }

    this.overlay = {
      enabled: overlay !== undefined ? overlay : true,
      color: overlayColor || 'rgba(0, 0, 0, 0.5)',
    }
  }

  setupButtons(buttonOptionsArray) {
    for (const buttonOptions of buttonOptionsArray) {
      const button = new Button(this.game, buttonOptions)
      this.buttons.push(button)
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

    for (const button of this.buttons) {
      button.draw(ctx)
    }
  }

  close() {
    this.game.dialogManager.closeDialog(this)
    if (this.onClose) {
      this.onClose()
    }
  }
}

export default Dialog
