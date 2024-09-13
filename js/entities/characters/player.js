import { Attackable } from '../../composables/attackable.js'
import { Movable } from '../../composables/movable.js'
import { Positionable } from '../../composables/positionable.js'
import { Spriteable } from '../../composables/spriteable.js'
import { ASSETS } from '../../constants/assets.js'
import PLAYER_STATE from '../../constants/player-state.js'
import { SETTINGS } from '../../constants/settings.js'
import { keyboard } from '../../library/interactive.js'
import {
  getGroundY,
  isOutOfBoundsLeft,
  isOutOfBoundsRight,
} from '../../utils/bounderies.js'
import StateMachine from '../../utils/state-machine.js'

export class Player {
  constructor(game, x, y) {
    const frameWidth = 124
    const frameHeight = 71
    const spriteScale = 1.7
    const attackDuration = 0.6

    this.width = 85
    this.height = 95
    this.offsetX = 55
    this.offsetY = 30

    const animations = {
      [PLAYER_STATE.IDLE]: {
        spriteSheet: game[ASSETS.PLAYER_IDLE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.1,
      },
      [PLAYER_STATE.MOVING]: {
        spriteSheet: game[ASSETS.PLAYER_MOVE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.1,
      },
      [PLAYER_STATE.JUMPING]: {
        spriteSheet: game[ASSETS.PLAYER_JUMP_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 2,
        frameTime: 0.1,
      },
      [PLAYER_STATE.ATTACKING]: {
        spriteSheet: game[ASSETS.PLAYER_ATTACK_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.1,
      },
    }

    Object.assign(
      this,
      Positionable(),
      Spriteable(animations, spriteScale, PLAYER_STATE.IDLE),
      Movable(this.width, this.height, this.offsetX),
      Attackable(attackDuration, 10),
    )

    this.setPosition(x, this.groundY)
    this.setupStates()
    this.setupKeyboard()
  }

  setupStates() {
    this.stateMachine = new StateMachine(PLAYER_STATE.IDLE)
    this.stateMachine.addState(PLAYER_STATE.IDLE, {
      enter: () => console.log('Entering IDLE state'),
      update: () => {
        if (!this.isGrounded) {
          this.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (this.isMoving) {
          this.stateMachine.setState(PLAYER_STATE.MOVING)
        } else if (this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.ATTACKING)
        }
      },
      exit: () => console.log('Exiting IDLE state'),
    })

    this.stateMachine.addState(PLAYER_STATE.MOVING, {
      enter: () => console.log('Entering MOVING state'),
      update: () => {
        if (!this.isGrounded) {
          this.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (!this.isMoving) {
          this.stateMachine.setState(PLAYER_STATE.IDLE)
        } else if (this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.ATTACKING)
        }
      },
      exit: () => console.log('Exiting MOVING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.JUMPING, {
      enter: () => console.log('Entering JUMPING state'),
      update: () => {
        if (this.isGrounded) {
          if (this.isMoving) {
            this.stateMachine.setState(PLAYER_STATE.MOVING)
          } else {
            this.stateMachine.setState(PLAYER_STATE.IDLE)
          }
        }
      },
      exit: () => console.log('Exiting JUMPING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.ATTACKING, {
      enter: () => console.log('Entering ATTACKING state'),
      update: () => {
        if (!this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('Exiting ATTACKING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.HURTING, {
      enter: () => console.log('Entering HURTING state'),
      update: () => {
        if (this.isMoving) {
          this.stateMachine.setState(PLAYER_STATE.MOVING)
        } else if (this.isGrounded) {
          this.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('Exiting HURTING state'),
    })
  }

  setupKeyboard() {
    let leftArrow = keyboard('ArrowLeft'),
      a = keyboard('a'),
      rightArrow = keyboard('ArrowRight'),
      d = keyboard('d'),
      enter = keyboard('Enter'),
      space = keyboard(' ')

    leftArrow.press = a.press = () => {
      this.flipX = true
      if (!isOutOfBoundsLeft(this.x)) {
        this.moveLeft()
      }
    }
    leftArrow.release = a.release = () => {
      if (!rightArrow.isDown && !d.isDown) {
        this.stopMoving()
      }
    }

    rightArrow.press = d.press = () => {
      this.flipX = false
      if (!isOutOfBoundsRight(this.x, this.width)) {
        this.moveRight()
      }
    }
    rightArrow.release = d.release = () => {
      if (!leftArrow.isDown && !a.isDown) {
        this.stopMoving()
      }
    }

    enter.press = () => {
      this.stopMoving()
      this.attack()
    }

    space.press = () => this.jump()
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.updateMovement()
    this.updateSpriteState(this.stateMachine.currentState)
    this.updateSprite(deltaTime)
  }

  draw(ctx) {
    this.drawSprite(ctx)
    if (SETTINGS.DEBUG) {
      this.drawDebugInfo(ctx)
    }
  }

  drawDebugInfo(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, 200, 140)

    ctx.font = '15px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(`Player SpeedX: ${this.speedX.toFixed(2)}`, 10, 20)
    ctx.fillText(`Player SpeedY: ${this.speedY.toFixed(2)}`, 10, 40)
    ctx.fillText(`Player isGrounded: ${this.isGrounded}`, 10, 60)
    ctx.fillText(`Player isMoving: ${this.isMoving}`, 10, 80)
    ctx.fillText(`Player isAttacking: ${this.isAttacking}`, 10, 100)
    ctx.fillText(`Player state: ${this.stateMachine.currentState}`, 10, 120)

    ctx.strokeStyle = 'red'
    ctx.strokeRect(
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.width,
      this.height,
    )
    //add label for player
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(
      `Player X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`,
      this.x + 20,
      this.y + 20,
    )
  }
}
