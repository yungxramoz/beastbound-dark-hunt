import STYLE from '../constants/style.js'
import { createTypingEffect } from '../utils/effects.js'
import {
  addBorder,
  drawImage,
  drawRect,
  drawText,
  drawWrappedText,
} from '../utils/ui.js'
import Dialog from './dialog.js'

class SpeechDialog extends Dialog {
  constructor(
    game,
    {
      npc,
      text,
      typingSpeed,
      dialogWidth,
      dialogHeight,
      dialogX,
      dialogY,
      buttons,
      onClose,
    },
  ) {
    super(game, {
      dialogWidth,
      dialogHeight,
      dialogX,
      dialogY,
      buttons,
      onClose,
    })

    this.npc = npc
    this.text = text
    this.typingSpeed = typingSpeed || 80

    this.typingEffect = createTypingEffect(this.text, this.typingSpeed)

    this.npcAvatar = this.npc.avatar

    this.dialogWidth = dialogWidth || this.game.canvas.width - 100
    this.dialogHeight = dialogHeight || this.game.canvas.height / 3 + 50
    this.dialogX = dialogX || (this.game.canvas.width - this.dialogWidth) / 2
    this.dialogY = dialogY || 50

    if (buttons) {
      this.positionButtons(buttons)
    }
  }

  positionButtons(buttonOptionsArray) {
    let buttonOffsetX = 20
    for (const buttonOptions of buttonOptionsArray) {
      buttonOptions.x =
        this.dialogX + this.dialogWidth - buttonOptions.width - buttonOffsetX
      buttonOptions.y =
        this.dialogY + this.dialogHeight - buttonOptions.height - 20
      buttonOffsetX += buttonOptions.width + 20
    }

    this.buttons = []
    this.setupButtons(buttonOptionsArray)
  }

  update(deltaTime) {
    super.update(deltaTime)

    if (!this.typingEffect.isTypingComplete) {
      this.typingEffect.update(deltaTime)
    }
  }

  draw(ctx) {
    super.draw(ctx)

    let avatarSize = 0

    if (this.npcAvatar) {
      avatarSize = 128
      const avatarY = this.dialogY + 20
      const avatarX = this.dialogX + 20

      drawRect(
        ctx,
        avatarX,
        avatarY,
        avatarSize,
        avatarSize,
        STYLE.COLORS.PRIMARY_LIGHTER_3,
      )

      drawImage(ctx, this.npcAvatar, avatarX, avatarY, avatarSize, avatarSize)

      addBorder(ctx, avatarX, avatarY, avatarSize, avatarSize, {
        highlight: STYLE.COLORS.PRIMARY_LIGHTER_3,
        shadow: STYLE.COLORS.PRIMARY_LIGHTER_3,
      })
    }

    // Draw NPC name
    if (this.npc && this.npc.name) {
      const nameX = this.dialogX + avatarSize + 40
      const nameY = this.dialogY + 35
      drawText(ctx, this.npc.name, nameX, nameY, {
        size: STYLE.FONT_SIZE.LARGE,
        color: STYLE.COLORS.SECONDARY_LIGHTER_3,
      })
    }

    // Draw typed text
    const textX = this.dialogX + avatarSize + 40
    const textY = this.dialogY + 75
    const maxWidth = this.dialogWidth - avatarSize - 60
    drawWrappedText(
      ctx,
      this.typingEffect.typedText,
      textX,
      textY,
      maxWidth,
      22,
    )
  }
}

export default SpeechDialog
