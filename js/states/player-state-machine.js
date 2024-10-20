import { PLAYER_SPRITE } from '../constants/player-sprite.js'
import {
  playFootstep,
  playMaleYells,
  playSlash,
} from '../utils/sound-handler.js'
import StateMachine from './state-machine.js'

const PLAYER_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  JUMPING: 'JUMPING',
  FALLING: 'FALLING',
  ATTACKING: 'ATTACKING',
  INTERACTING: 'INTERACTING',
}

const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
}

class PlayerStateMachine extends StateMachine {
  constructor(player, initialState = PLAYER_STATE.IDLE) {
    super()

    this.player = player

    this.setupStates()
    this.setState(initialState)

    this.sound = {
      footstep: playFootstep(1.2),
      graspJump: playMaleYells(),
      graspAttack: playMaleYells(),
      slash: playSlash(),
    }
  }

  setupStates() {
    // IDLE
    this.addState(PLAYER_STATE.IDLE, {
      enter: () => {
        this.player.move.stop()
        this.player.sprite.setSprite(PLAYER_SPRITE.IDLE)
      },
      update: () => {
        if (this.player.j.isDown) {
          this.setState(PLAYER_STATE.ATTACKING)
        } else if (this.player.space.isDown) {
          this.setState(PLAYER_STATE.JUMPING)
        } else if (this.player.e.isDown) {
          this.setState(PLAYER_STATE.INTERACTING)
        } else if (
          (this.player.a.isDown || this.player.leftArrow.isDown) &&
          !this.player.position.isOutOfBoundsLeft()
        ) {
          this.setState(PLAYER_STATE.MOVING, { direction: DIRECTION.LEFT })
        } else if (
          (this.player.d.isDown || this.player.rightArrow.isDown) &&
          !this.player.position.isOutOfBoundsRight()
        ) {
          this.setState(PLAYER_STATE.MOVING, { direction: DIRECTION.RIGHT })
        }
      },
      exit: () => console.log('PLAYER: Exiting IDLE state'),
    })

    // MOVING
    this.addState(PLAYER_STATE.MOVING, {
      enter: ({ direction }) => {
        this.player.flipX = direction === DIRECTION.LEFT
        this.player.move[direction]()
        this.player.sprite.setSprite(PLAYER_SPRITE.MOVING)
        this.sound.footstep.restart()
      },
      update: () => {
        const isMovingLeft =
          this.player.a.isDown || this.player.leftArrow.isDown
        const isMovingRight =
          this.player.d.isDown || this.player.rightArrow.isDown

        if (isMovingLeft && isMovingRight) return

        if (
          (!isMovingLeft && !isMovingRight) ||
          this.player.j.isDown ||
          this.player.e.isDown
        ) {
          this.setState(PLAYER_STATE.IDLE)
        } else if (this.player.space.isDown) {
          this.setState(PLAYER_STATE.JUMPING)
        } else if (isMovingLeft && !this.player.flipX) {
          this.setState(PLAYER_STATE.MOVING, { direction: DIRECTION.LEFT })
        } else if (isMovingRight && this.player.flipX) {
          this.setState(PLAYER_STATE.MOVING, { direction: DIRECTION.RIGHT })
        }
      },
      exit: () => {
        console.log('PLAYER: Exiting MOVING state')
        this.sound.footstep.pause()
      },
    })

    // JUMPING
    this.addState(PLAYER_STATE.JUMPING, {
      enter: () => {
        this.player.move.jump()
        this.player.sprite.setSprite(PLAYER_SPRITE.JUMPING)
        this.sound.graspJump.playSection(13.45, 13.7)
      },
      update: () => {
        if (this.player.move.isFalling()) {
          this.setState(PLAYER_STATE.FALLING)
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
          this.setState(PLAYER_STATE.IDLE)
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
        this.sound.graspAttack.playSection(11.4, 11.8)
        this.sound.slash.playSection(16.9, 17.9)
      },
      update: () => {
        if (!this.player.attack.isAttacking) {
          this.setState(PLAYER_STATE.IDLE)
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
          this.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => console.log('PLAYER: Exiting INTERACTING state'),
    })
  }
}

export default PlayerStateMachine
export { PLAYER_STATE }
