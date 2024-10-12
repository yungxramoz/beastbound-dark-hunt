import { ASSETS_SRC } from '../constants/assets.js'
import SettlementScene from '../entities/scenes/settlement-scene.js'
import StateMachine from './state-machine.js'

const GAME_STATE = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
}

class GameStateMachine extends StateMachine {
  constructor(game, initialState = GAME_STATE.LOADING) {
    super()

    this.game = game

    this.setupStates()
    this.setState(initialState)
  }

  // Override the addState method to include the render function
  addState(
    name,
    { enter = () => {}, update = () => {}, render = () => {}, exit = () => {} },
  ) {
    super.addState(name, { enter, update, exit })
    this.states[name].render = render
  }

  setupStates() {
    // Loading
    this.addState(GAME_STATE.LOADING, {
      enter: () => {
        this.game.renderLoading()
        this.game.assets
          .load(ASSETS_SRC)
          .then(() => {
            this.setState(GAME_STATE.PLAYING)
          })
          .catch((error) => {
            console.error('Error loading assets:', error)
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
        this.game.gameLoop(0)
      },
      update: (deltaTime) => {
        if (this.game.esc.isDown) {
          this.setState(GAME_STATE.PAUSED)
          return
        }
        this.game.scene.update(deltaTime)
        this.game.dialogManager.update(deltaTime)
      },
      render: () => {
        this.game.render()
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
      render: () => {
        this.game.render()
      },
      exit: () => {},
    })
  }

  render() {
    const currentStateObj = this.states[this.currentState]
    if (currentStateObj && typeof currentStateObj.render === 'function') {
      currentStateObj.render()
    }
  }
}

export default GameStateMachine
export { GAME_STATE }
