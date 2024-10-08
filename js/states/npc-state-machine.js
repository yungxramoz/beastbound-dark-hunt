import CHIEF_NPC_SPRITE from '../constants/chief-npc-sprite.js'
import StateMachine from './state-machine.js'

const CHARACTER_STATE = {
  IDLE: 'IDLE',
  MOVING_LEFT: 'MOVING_LEFT',
  MOVING_RIGHT: 'MOVING_RIGHT',
  TALKING: 'TALKING',
}

class NpcStateMachine extends StateMachine {
  constructor(character) {
    super(CHARACTER_STATE.IDLE)

    this.character = character

    this.setupStates()
  }

  setupStates() {
    this.addState(CHARACTER_STATE.IDLE, {
      enter: () => {
        this.character.move.stop()
        this.character.sprite.setSprite(CHIEF_NPC_SPRITE.IDLE)
      },
      update: () => {
        if (this.isMoving) {
          this.setState(CHARACTER_STATE.MOVING_LEFT)
        }
      },
      exit: () => console.log('NPC: Exiting IDLE state'),
    })

    this.addState(CHARACTER_STATE.MOVING_LEFT, {
      enter: () => {
        this.character.flipX = true
        this.character.move.left()
        this.character.sprite.setSprite(CHIEF_NPC_SPRITE.MOVING)
      },
      update: () => {
        if (!this.isMoving) {
          this.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('NPC: Exiting MOVING state'),
    })

    this.addState(CHARACTER_STATE.MOVING_RIGHT, {
      enter: () => {
        this.character.flipX = false
        this.character.move.right()
        this.character.sprite.setSprite(CHIEF_NPC_SPRITE.MOVING)
      },
      update: () => {
        if (!this.isMoving) {
          this.setState(CHARACTER_STATE.IDLE)
        }
      },
      exit: () => console.log('NPC: Exiting MOVING state'),
    })
  }
}

export default NpcStateMachine
export { CHARACTER_STATE }
