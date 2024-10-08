import PLAYER_SPRITE from '../constants/player-sprite.js'
import StateMachine from './state-machine.js'

const PLAYER_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  MOVING_LEFT: 'MOVING_LEFT',
  MOVING_RIGHT: 'MOVING_RIGHT',
  JUMPING: 'JUMPING',
  FALLING: 'FALLING',
  ATTACKING: 'ATTACKING',
  HURTING: 'HURTING',
  INTERACTING: 'INTERACTING',
}

class PlayerStateMachine extends StateMachine {
  constructor(player) {
    super(PLAYER_STATE.IDLE)

    this.player = player

    this.setupStates()
  }

  setupStates() {
    // IDLE
    this.addState(PLAYER_STATE.IDLE, {
      enter: () => {
        this.player.move.stop()
        this.player.sprite.setSprite(PLAYER_SPRITE.IDLE)
      },
      update: () => {
        if (
          (this.player.a.isDown || this.player.leftArrow.isDown) &&
          !this.player.position.isOutOfBoundsLeft()
        ) {
          this.player.stateMachine.setState(PLAYER_STATE.MOVING_LEFT)
        } else if (
          (this.player.d.isDown || this.player.rightArrow.isDown) &&
          !this.player.position.isOutOfBoundsRight()
        ) {
          this.player.stateMachine.setState(PLAYER_STATE.MOVING_RIGHT)
        } else if (this.player.j.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.ATTACKING)
        } else if (this.player.space.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (this.player.e.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.INTERACTING)
        }
      },
      exit: () => console.log('PLAYER: Exiting IDLE state'),
    })

    // MOVING LEFT
    this.addState(PLAYER_STATE.MOVING_LEFT, {
      enter: () => {
        this.player.flipX = true
        this.player.move.left()
        this.player.sprite.setSprite(PLAYER_SPRITE.MOVING)
      },
      update: () => {
        if (
          (this.player.a.isUp && this.player.leftArrow.isUp) ||
          this.player.position.isOutOfBoundsLeft()
        ) {
          this.player.stateMachine.setState(PLAYER_STATE.IDLE)
        } else if (this.player.d.isDown || this.player.rightArrow.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.MOVING_RIGHT)
        } else if (this.player.j.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.ATTACKING)
        } else if (this.player.space.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (this.player.e.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.INTERACTING)
        }
      },
      exit: () => console.log('PLAYER: Exiting MOVING_LEFT state'),
    })

    // MOVING RIGHT
    this.addState(PLAYER_STATE.MOVING_RIGHT, {
      enter: () => {
        this.player.flipX = false
        this.player.move.right()
        this.player.sprite.setSprite(PLAYER_SPRITE.MOVING)
      },
      update: () => {
        if (
          (this.player.d.isUp && this.player.rightArrow.isUp) ||
          this.player.position.isOutOfBoundsRight()
        ) {
          this.player.stateMachine.setState(PLAYER_STATE.IDLE)
        } else if (this.player.a.isDown || this.player.leftArrow.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.MOVING_LEFT)
        } else if (this.player.j.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.ATTACKING)
        } else if (this.player.space.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (this.player.e.isDown) {
          this.player.stateMachine.setState(PLAYER_STATE.INTERACTING)
        }
      },
      exit: () => console.log('PLAYER: Exiting MOVING_RIGHT state'),
    })

    // JUMPING
    this.addState(PLAYER_STATE.JUMPING, {
      enter: () => {
        this.player.move.jump()
        this.player.sprite.setSprite(PLAYER_SPRITE.JUMPING)
      },
      update: () => {
        if (this.player.move.isFalling()) {
          this.player.stateMachine.setState(PLAYER_STATE.FALLING)
        }
      },
      exit: () => console.log('PLAYER: Exiting JUMPING state'),
    })

    // FALLING
    this.addState(PLAYER_STATE.FALLING, {
      enter: () => {
        this.player.sprite.setSprite(PLAYER_SPRITE.FALLING)
      },
      update: () => {
        if (this.player.position.isGrounded()) {
          this.player.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('PLAYER: Exiting FALLING state'),
    })

    // ATTACKING
    this.addState(PLAYER_STATE.ATTACKING, {
      enter: () => {
        this.player.move.stop()
        this.player.attack.hit()
        this.player.sprite.setSprite(PLAYER_SPRITE.ATTACKING)
      },
      update: () => {
        if (!this.player.attack.isAttacking) {
          this.player.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('PLAYER: Exiting ATTACKING state'),
    })

    // INTERACTING
    this.addState(PLAYER_STATE.INTERACTING, {
      enter: () => {
        this.player.move.stop()
        this.player.sprite.setSprite(PLAYER_SPRITE.IDLE)
        this.player.checkForInteraction()
      },
      update: () => {
        if (!this.player.isInteracting) {
          this.player.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('PLAYER: Exiting INTERACTING state'),
    })
  }
}

export default PlayerStateMachine
export { PLAYER_STATE }
