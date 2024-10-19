import { CHIEF_NPC_SPRITE } from '../constants/chief-npc-sprite.js'
import { playFootstep } from '../utils/sound-handler.js'
import StateMachine from './state-machine.js'

const CHARACTER_STATE = {
  IDLE: 'IDLE',
  MOVING: 'MOVING',
  INTERACTING: 'INTERACTING',
}

const DIRECTION = {
  LEFT: 'left',
  RIGHT: 'right',
}

class NpcStateMachine extends StateMachine {
  constructor(
    entity,
    initialState = CHARACTER_STATE.IDLE,
    { minX = 0, maxX = entity.game.canvas.width } = {},
  ) {
    super()

    this.entity = entity
    this.stateTimer = 5

    this.minX = minX
    this.maxX = maxX

    this.setupStates()
    this.setState(initialState)

    this.sound = {
      footstep: playFootstep(0.9),
    }
  }

  setupStates() {
    // IDLE
    this.addState(CHARACTER_STATE.IDLE, {
      enter: () => {
        this.entity.move.stop()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.IDLE)
        // Set idle duration between 2 and 15 seconds
        this.stateTimer = 2 + Math.random() * 13
      },
      update: (deltaTime) => {
        this.stateTimer -= deltaTime
        if (this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.INTERACTING)
        } else if (this.stateTimer <= 0) {
          const direction =
            Math.random() < 0.5 ? DIRECTION.LEFT : DIRECTION.RIGHT
          this.setState(CHARACTER_STATE.MOVING, { direction })
        }
      },
      exit: () => console.log('NPC: Exiting IDLE state'),
    })

    // MOVING
    this.addState(CHARACTER_STATE.MOVING, {
      enter: ({ direction }) => {
        this.entity.flipX = direction === DIRECTION.LEFT
        this.entity.move[direction]()
        this.entity.sprite.setSprite(CHIEF_NPC_SPRITE.MOVING)
        // Set move duration between 1 and 5 seconds
        this.stateTimer = 1 + Math.random() * 4
        this.sound.footstep.restart()
      },
      update: (deltaTime) => {
        this.stateTimer -= deltaTime
        if (this.entity.interaction.isInteracting) {
          this.setState(CHARACTER_STATE.INTERACTING)
        } else if (this.stateTimer <= 0) {
          this.setState(CHARACTER_STATE.IDLE)
        } else if (this.entity.position.x <= this.minX) {
          this.setState(CHARACTER_STATE.MOVING, { direction: DIRECTION.RIGHT })
        } else if (this.entity.position.x + this.entity.width >= this.maxX) {
          this.setState(CHARACTER_STATE.MOVING, { direction: DIRECTION.LEFT })
        }
      },
      exit: () => {
        console.log('NPC: Exiting MOVING state')
        this.sound.footstep.pause()
      },
    })

    // TALKING
    this.addState(CHARACTER_STATE.INTERACTING, {
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
