import { STYLE } from '../constants/style.js'
import { createTypingEffect } from '../utils/effects.js'
import {
  addBorder,
  drawImage,
  drawRect,
  drawText,
  drawWrappedText,
  resetStyles,
} from '../utils/ui.js'
import { Button } from './button.js'

export class Dialog {
  constructor(game, options) {
    this.game = game
    this.npc = options.npc
    this.text = options.text
    this.onClose = options.onClose

    this.dialogHeight = options.dialogHeight || this.game.canvas.height / 3 + 50
    this.dialogWidth = options.dialogWidth || this.game.canvas.width - 100
    this.dialogX = options.dialogX || 50
    this.dialogY = options.dialogY || 50

    this.typingEffect = createTypingEffect(this.text, options.typingSpeed || 80)

    this.buttons = []
    this.isButtonsVisible = false
    if (options.buttons) {
      let buttonOffsetX = 20
      for (const buttonOptions of options.buttons) {
        buttonOptions.x =
          this.dialogX + this.dialogWidth - buttonOptions.width - buttonOffsetX
        buttonOptions.y =
          this.dialogY + this.dialogHeight - buttonOptions.height - 20
        const button = new Button(game, buttonOptions)
        this.buttons.push(button)
        buttonOffsetX += buttonOptions.width + 20
      }
    }

    this.npcAvatar = this.npc.avatar
  }

  update(deltaTime) {
    if (!this.typingEffect.isTypingComplete) {
      this.typingEffect.update(deltaTime)
      if (this.typingEffect.isTypingComplete) {
        this.isButtonsVisible = true
      }
    } else {
      for (const button of this.buttons) {
        button.update(deltaTime)
      }
    }
  }

  draw(ctx) {
    // Draw dialog
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

    // Draw NPC avatar
    if (this.npcAvatar) {
      const avatarHeight = 128
      const avatarWidth = 128
      const avatarY = 70
      const avatarX = this.dialogWidth - 98

      drawRect(
        ctx,
        avatarX,
        avatarY,
        avatarHeight,
        avatarWidth,
        STYLE.COLORS.PRIMARY_LIGHTER_3,
      )

      drawImage(
        ctx,
        this.npcAvatar,
        avatarX,
        avatarY,
        avatarHeight,
        avatarWidth,
      )

      addBorder(ctx, avatarX, avatarY, avatarHeight, avatarWidth, {
        highlight: STYLE.COLORS.PRIMARY_LIGHTER_3,
        shadow: STYLE.COLORS.PRIMARY_LIGHTER_3,
      })
    }

    // Draw NPC name
    drawText(ctx, this.npc.name, this.dialogX + 20, this.dialogX + 20, {
      size: STYLE.FONT_SIZE.LARGE,
      color: STYLE.COLORS.SECONDARY_LIGHTER_3,
    })

    // Draw typed text
    const textX = this.dialogX + 20
    const textY = this.dialogY + 60
    const maxWidth = this.game.canvas.width - 270
    drawWrappedText(
      ctx,
      this.typingEffect.typedText,
      textX,
      textY,
      maxWidth,
      22,
    )

    // Reset styles
    resetStyles(ctx)

    // Draw buttons if typing is complete
    if (this.isButtonsVisible) {
      for (const button of this.buttons) {
        button.draw(ctx)
      }
    }
  }

  close() {
    this.game.dialogManager.closeDialog(this)
    if (this.onClose) {
      this.onClose()
    }
  }
}
