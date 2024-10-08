import Character from '../../components/character.js'
import Interactable from '../../composables/interactable.js'
import { ASSETS } from '../../constants/assets.js'
import CHIEF_NPC_SPRITE from '../../constants/chief-npc-sprite.js'
import { SETTINGS } from '../../constants/settings.js'
import SpeechDialog from '../../display/speech-dialog.js'
import NpcStateMachine from '../../states/npc-state-machine.js'
import { addBorder, drawRect, drawText } from '../../utils/ui.js'

class ChiefNpc extends Character {
  constructor(game, x, y, name) {
    super(game, {
      x,
      y,
      spriteScale: 1.8,
      width: 75,
      height: 95,
      moveSpeed: 1,
    })

    this.game = game

    this.flipX = true
    this.name = name
    this.avatar = game.assets[ASSETS.CHIEF_AVATAR]

    this.interaction = new Interactable(game, this)

    this.stateMachine = new NpcStateMachine(this)
    this.sprite.setSprite(CHIEF_NPC_SPRITE.IDLE)
  }

  createDialog() {
    const dialog = new SpeechDialog(this.game, {
      npc: this,
      text: `Hunter, dark times are upon us. A beast lurks beyond the village, spreading fear and chaos. We need your strength to end this threat.`,
      buttons: [
        {
          width: 150,
          height: 40,
          text: 'Accept',
          onClick: () => {
            dialog.close()
          },
        },
        {
          width: 150,
          height: 40,
          text: 'Decline',
          onClick: () => {
            dialog.close()
          },
        },
      ],
      onClose: () => {
        this.interaction.end()
      },
    })

    this.game.dialogManager.openDialog(dialog)
  }

  update(deltaTime) {
    super.update(deltaTime)
    this.stateMachine.update(deltaTime)
  }

  draw(ctx) {
    super.draw(ctx)
    if (SETTINGS.DEBUG) {
      this.drawDebugInfo(ctx)
    }
  }

  drawDebugInfo(ctx) {
    drawRect(ctx, 240, 0, 230, 100, 'rgba(0, 0, 0, 0.5)')
    drawText(ctx, 'NPC Chief', 250, 10, {
      size: 10,
    })
    drawText(ctx, `SpeedX: ${this.move.speedX.toFixed(2)}`, 250, 40, {
      size: 8,
    })
    drawText(ctx, `SpeedY: ${this.move.speedY.toFixed(2)}`, 250, 60, {
      size: 8,
    })
    drawText(ctx, `State: ${this.stateMachine.currentState}`, 250, 80, {
      size: 8,
    })

    addBorder(ctx, this.position.x, this.position.y, this.width, this.height, {
      border: 'red',
    })
    const text = `Player X: ${this.position.x.toFixed(
      2,
    )} Y: ${this.position.y.toFixed(2)}`
    const textWidth = ctx.measureText(text).width
    const textX = this.position.x + this.width / 2 - textWidth / 2

    drawText(ctx, text, textX, this.position.y - 20, {
      size: 8,
    })
  }
}

export default ChiefNpc
