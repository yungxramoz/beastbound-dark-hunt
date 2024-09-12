import { Attackable } from '../../composables/attackable.js'
import { Movable } from '../../composables/movable.js'
import { Positionable } from '../../composables/positionable.js'
import { Spriteable } from '../../composables/spriteable.js'
import { ASSETS } from '../../constants/assets.js'
import PLAYER_STATE from '../../constants/player-state.js'
import { keyboard } from '../../library/interactive.js'
import StateMachine from '../../utils/state-machine.js'

export class Player {
  constructor(game, x, y) {
    Object.assign(this, Positionable(), Spriteable(), Movable(), Attackable())

    this.setPosition(x, y)

    this.spriteScale = 1.7
    this.animations = {
      [PLAYER_STATE.IDLE]: {
        spriteSheet: game[ASSETS.PLAYER_IDLE_SPRITE],
        frameWidth: 124,
        frameHeight: 71,
        numFrames: 6,
        frameTime: 0.1,
      },
      [PLAYER_STATE.MOVING]: {
        spriteSheet: game[ASSETS.PLAYER_MOVE_SPRITE],
        frameWidth: 124,
        frameHeight: 71,
        numFrames: 6,
        frameTime: 0.1,
      },
      [PLAYER_STATE.JUMPING]: {
        spriteSheet: game[ASSETS.PLAYER_JUMP_SPRITE],
        frameWidth: 124,
        frameHeight: 71,
        numFrames: 2,
        frameTime: 0.1,
      },
      [PLAYER_STATE.ATTACKING]: {
        spriteSheet: game[ASSETS.PLAYER_ATTACK_SPRITE],
        frameWidth: 124,
        frameHeight: 71,
        numFrames: 6,
        frameTime: 0.1,
      },
    }

    this.attackDuration = 0.6

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

    leftArrow.press = () => {
      this.flipX = true
      this.moveLeft()
    }
    leftArrow.release = () => this.stopMoving()
    a.press = () => {
      this.flipX = true
      this.moveLeft()
    }
    a.release = () => this.stopMoving()

    rightArrow.press = () => {
      this.flipX = false
      this.moveRight()
    }
    rightArrow.release = () => this.stopMoving()
    d.press = () => {
      this.flipX = false
      this.moveRight()
    }
    d.release = () => this.stopMoving()

    enter.press = () => this.attack()

    space.press = () => this.jump()
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.updateMovement(deltaTime)
    this.updateSpriteState(this.stateMachine.currentState)
    this.updateSprite(deltaTime)
  }

  draw(ctx) {
    this.drawSprite(ctx)
  }
}
