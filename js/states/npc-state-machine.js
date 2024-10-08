import { CHIEF_NPC_SPRITE } from '../constants/chief-npc-sprite.js'
import StateMachine from './state-machine.js'

const CHARACTER_STATE = {
  IDLE: 'IDLE',
  MOVING_LEFT: 'MOVING_LEFT',
  MOVING_RIGHT: 'MOVING_RIGHT',
  TALKING: 'TALKING',
}

class NpcStateMachine extends StateMachine {
  constructor(entity, { minX = 0, maxX = entity.game.canvas.width } = {}) {
    super(CHARACTER_STATE.IDLE)

    this.entity = entity
    this.stateTimer = 5

    this.minX = minX
    this.maxX = maxX

    this.setupStates()
  }

  setupStates() {
    // IDLE
    this.addState(CHARACTER_STATE.IDLE, {
      enter: () => {
        this.entity.move.stop()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.IDLE)
        // Set idle duration between 2 and 5 seconds
        this.stateTimer = 2 + Math.random() * 3
      },
      update: (deltaTime) => {
        this.stateTimer -= deltaTime
        if (this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.TALKING)
        } else if (this.stateTimer <= 0) {
          const nextState =
            Math.random() < 0.5
              ? CHARACTER_STATE.MOVING_LEFT
              : CHARACTER_STATE.MOVING_RIGHT
          this.setState(nextState)
        }
      },
      exit: () => console.log('NPC: Exiting IDLE state'),
    })

    // MOVING_LEFT
    this.addState(CHARACTER_STATE.MOVING_LEFT, {
      enter: () => {
        this.entity.flipX = true
        this.entity.move.left()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.MOVING)
        // Set move duration between 1 and 3 seconds
        this.stateTimer = 1 + Math.random() * 2
      },
      update: (deltaTime) => {
        this.stateTimer -= deltaTime
        if (this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.TALKING)
        } else if (this.entity.position.x <= this.minX) {
          this.setState(CHARACTER_STATE.MOVING_RIGHT)
        } else if (this.stateTimer <= 0) {
          this.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('NPC: Exiting MOVING LEFT state'),
    })

    // MOVING_RIGHT
    this.addState(CHARACTER_STATE.MOVING_RIGHT, {
      enter: () => {
        this.entity.flipX = false
        this.entity.move.right()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.MOVING)
        // Set move duration between 1 and 3 seconds
        this.stateTimer = 1 + Math.random() * 2
      },
      update: (deltaTime) => {
        this.stateTimer -= deltaTime
        if (this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.TALKING)
        } else if (this.entity.position.x + this.entity.width >= this.maxX) {
          this.setState(CHARACTER_STATE.MOVING_LEFT)
        } else if (this.stateTimer <= 0) {
          this.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('NPC: Exiting MOVING RIGHT state'),
    })

    // TALKING
    this.addState(CHARACTER_STATE.TALKING, {
      enter: () => {
        this.entity.move.stop()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.IDLE)
        this.entity.createDialog()
      },
      update: () => {
        if (!this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('NPC: Exiting TALKING state'),
    })
  }
}

export default NpcStateMachine
export { CHARACTER_STATE }
