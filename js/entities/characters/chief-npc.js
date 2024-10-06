import { Character } from '../../components/character.js'
import { Interactable } from '../../composables/interactable.js'
import { ASSETS } from '../../constants/assets.js'
import CHARACTER_STATE from '../../constants/character-state.js'
import { SETTINGS } from '../../constants/settings.js'
import { Dialog } from '../../ui/dialog.js'
import { Behavior, BehaviorManager } from '../../utils/behavior-manager.js'
import StateMachine from '../../utils/state-machine.js'

export class ChiefNpc extends Character {
  constructor(game, x, name) {
    const frameWidth = 39
    const frameHeight = 52
    const spriteScale = 1.8
    const spriteOffsetX = 0
    const spriteOffsetY = 25

    const width = 75
    const height = 95
    const offsetX = 0
    const offsetY = 30

    const animations = {
      [CHARACTER_STATE.IDLE]: {
        spriteSheet: game.assets[ASSETS.CHIEF_IDLE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 4,
        frameTime: 0.24,
      },
      [CHARACTER_STATE.MOVING]: {
        spriteSheet: game.assets[ASSETS.CHIEF_MOVE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.16,
      },
    }

    super(
      x,
      animations,
      spriteScale,
      CHARACTER_STATE.IDLE,
      width,
      height,
      offsetX,
      offsetY,
      spriteOffsetX,
      spriteOffsetY,
    )

    Object.assign(this, Interactable(game))

    this.game = game

    this.flipX = true
    this.maxSpeed = 1
    this.name = name
    this.avatar = game.assets[ASSETS.CHIEF_AVATAR]

    this.setupStates()
    this.setupBehaviors()
    this.setupInteractable()
  }

  setupStates() {
    this.stateMachine = new StateMachine(CHARACTER_STATE.IDLE)
    this.stateMachine.addState(CHARACTER_STATE.IDLE, {
      enter: () => console.log('Entering IDLE state'),
      update: () => {
        if (this.isMoving) {
          this.stateMachine.setState(CHARACTER_STATE.MOVING)
        }
      },
      exit: () => console.log('Exiting IDLE state'),
    })

    this.stateMachine.addState(CHARACTER_STATE.MOVING, {
      enter: () => console.log('Entering MOVING state'),
      update: () => {
        if (!this.isMoving) {
          this.stateMachine.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('Exiting MOVING state'),
    })
  }

  setupBehaviors() {
    this.behaviorManager = new BehaviorManager(this, [
      new Behavior(
        'idle',
        (done) => {
          this.stopMoving()
          const duration = Math.random() * 2000 + 1000
          this.behaviorManager.currentTimeout = setTimeout(done, duration)
        },
        4,
      ), // Higher weight for idling

      new Behavior(
        'walkLeft',
        (done) => {
          if (
            this.game.interaction.isInteracting &&
            this === this.game.interaction.entity
          ) {
            done()
            return
          }
          this.flipX = true
          this.moveLeft()
          const duration = Math.random() * 2000 + 1000
          this.behaviorManager.currentTimeout = setTimeout(() => {
            this.stopMoving()
            done()
          }, duration)
        },
        1,
      ),

      new Behavior(
        'walkRight',
        (done) => {
          if (
            this.game.interaction.isInteracting &&
            this === this.game.interaction.entity
          ) {
            done()
            return
          }
          this.flipX = false
          this.moveRight()
          const duration = Math.random() * 2000 + 1000
          this.behaviorManager.currentTimeout = setTimeout(() => {
            this.stopMoving()
            done()
          }, duration)
        },
        1,
      ),
    ])

    this.behaviorManager.start()
  }

  createDialog(player) {
    // Create the dialog specific to the ChiefNpc
    const dialog = new Dialog(this.game, {
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
        this.endInteraction()
      },
    })

    this.game.dialogManager.openDialog(dialog)
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.updateSpriteState(this.stateMachine.currentState)
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
