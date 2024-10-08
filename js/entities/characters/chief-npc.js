import Character from '../../components/character.js'
import Interactable from '../../composables/interactable.js'
import { ASSETS } from '../../constants/assets.js'
import { SETTINGS } from '../../constants/settings.js'
import SpeechDialog from '../../display/speech-dialog.js'
import NpcStateMachine from '../../states/npc-state-machine.js'

export class ChiefNpc extends Character {
  constructor(game, x, y, name) {
    super(game, {
      x,
      y,
      spriteScale: 1.8,
      width: 75,
      height: 95,
      offsetX: 0,
      offsetY: 30,
      spriteOffsetX: 0,
      spriteOffsetY: 25,
    })

    this.game = game

    this.flipX = true
    this.name = name
    this.avatar = game.assets[ASSETS.CHIEF_AVATAR]

    this.interaction = new Interactable(game, this)

    this.stateMachine = new NpcStateMachine(this)
  }

  createDialog() {
    // Create the dialog specific to the ChiefNpc
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
        this.interaction.endInteraction()
      },
    })

    this.game.dialogManager.openDialog(dialog)
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    super.update(deltaTime)
  }

  draw(ctx) {
    super.draw(ctx)
    if (SETTINGS.DEBUG) {
      this.drawDebugInfo(ctx)
    }
  }

  drawDebugInfo(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(210, 0, 200, 140)

    ctx.font = '15px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(`Chief NPC SpeedX: ${this.speedX.toFixed(2)}`, 220, 20)
    ctx.fillText(`Chief NPC SpeedY: ${this.speedY.toFixed(2)}`, 220, 40)
    ctx.fillText(`Chief NPC isGrounded: ${this.isGrounded}`, 220, 60)
    ctx.fillText(`Chief NPC isMoving: ${this.isMoving}`, 220, 80)
    ctx.fillText(`Chief NPC state: ${this.stateMachine.currentState}`, 220, 100)

    ctx.strokeStyle = 'red'
    ctx.strokeRect(
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.width,
      this.height,
    )
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(
      `Chief NPC X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`,
      this.x + 20,
      this.y + 20,
    )
  }
}
