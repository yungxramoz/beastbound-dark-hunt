import PLAYER_STATE from '../constants/player-state'
import { createStateMachine } from '../utils/state-machine'

const playerStateMachine = createStateMachine(PLAYER_STATE.IDLE)

playerStateMachine.addState(PLAYER_STATE.IDLE, {
  enter: () => console.log('Entering IDLE state'),
  update: (deltaTime) => {
    if (playerInput.isMoving()) {
      playerStateMachine.setState(PLAYER_STATE.MOVING)
    }
  },
  exit: () => console.log('Exiting IDLE state'),
})

playerStateMachine.addState(PLAYER_STATE.MOVING, {
  enter: () => console.log('Entering MOVING state'),
  update: (deltaTime) => {
    if (!playerInput.isMoving()) {
      playerStateMachine.setState(PLAYER_STATE.IDLE)
    } else if (playerInput.isJumping()) {
      playerStateMachine.setState(PLAYER_STATE.JUMPING)
    }
  },
  exit: () => console.log('Exiting MOVING state'),
})

playerStateMachine.addState(PLAYER_STATE.JUMPING, {
  enter: () => console.log('Entering JUMPING state'),
  update: (deltaTime) => {
    if (playerIsGrounded()) {
      playerStateMachine.setState(PLAYER_STATE.IDLE)
    }
  },
  exit: () => console.log('Exiting JUMPING state'),
})

playerStateMachine.addState(PLAYER_STATE.ATTACKING, {
  enter: () => console.log('Entering ATTACKING state'),
  update: (deltaTime) => {
    if (attackIsOver()) {
      playerStateMachine.setState(PLAYER_STATE.IDLE)
    }
  },
  exit: () => console.log('Exiting ATTACKING state'),
})

playerStateMachine.addState(PLAYER_STATE.HURTING, {
  enter: () => console.log('Entering HURTING state'),
  update: (deltaTime) => {
    if (playerInput.isMoving()) {
      playerStateMachine.setState(PLAYER_STATE.MOVING)
    }
  },
  exit: () => console.log('Exiting HURTING state'),
})
