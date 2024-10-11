import { ASSETS_SRC } from '../constants/assets.js'
import SettlementScene from '../entities/scenes/settlement-scene.js'
import StateMachine from './state-machine.js'

const GAME_STATE = {
  INITIALIZING: 'INITIALIZING',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
}

class GameStateMachine extends StateMachine {
  constructor(game) {
    super(GAME_STATE.INITIALIZING)

    this.game = game

    this.setupStates()
  }

  setupStates() {
    // Initializing
    this.addState(GAME_STATE.INITIALIZING, {
      enter: () => {},
      update: () => {},
      exit: () => {},
    })

    // Loading
    this.addState(GAME_STATE.LOADING, {
      enter: () => {
        this.game.renderLoading()
        this.game.assets.load(ASSETS_SRC).then(() => {
          this.setState(GAME_STATE.PLAYING)
        })
      },
      update: () => {},
      exit: () => {
        this.game.scene = new SettlementScene(this.game)
      },
    })

    // Playing
    this.addState(GAME_STATE.PLAYING, {
      enter: () => {
        this.game.startGame()
      },
      update: (deltaTime) => {
        if (this.game.esc.isDown) {
          this.setState(GAME_STATE.PAUSED)
        } else {
          this.game.scene.update(deltaTime)
          this.game.dialogManager.update(deltaTime)
        }
      },
      exit: () => {},
    })

    // Paused
    this.addState(GAME_STATE.PAUSED, {
      enter: () => {
        this.game.pauseGame()
      },
      update: (deltaTime) => {
        this.game.dialogManager.update(deltaTime)
      },
      exit: () => {},
    })
  }
}

export default GameStateMachine
export { GAME_STATE }
