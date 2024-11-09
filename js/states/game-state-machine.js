import { updateParticles } from '../components/particle.js'
import { ASSETS_SRC } from '../constants/assets.js'
import ForestScene from '../entities/scenes/forest-scene.js'
import MenuScene from '../entities/scenes/menu-scene.js'
import SettlementScene from '../entities/scenes/settlement-scene.js'
import dataStore from '../store/data-store.js'
import { getScene, setScene } from '../store/scene-data.js'
import StateMachine from './state-machine.js'

const GAME_STATE = {
  LOADING: 'LOADING',
  MENU: 'MENU',
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
    // Menu
    this.addState(GAME_STATE.MENU, {
      enter: () => {
        setScene(new MenuScene(this.game))
        this.game.gameLoop(0)
      },
      update: (deltaTime) => {
        getScene().update(deltaTime)
        this.game.dialogManager.update(deltaTime)
      },
      render: () => {
        this.game.render()
      },
      exit: () => {
        // setScene(new SettlementScene(this.game))
        setScene(new ForestScene(this.game))
      },
    })

    // Loading
    this.addState(GAME_STATE.LOADING, {
      enter: () => {
        this.game.assets
          .load(ASSETS_SRC)
          .then(() => {
            this.setState(GAME_STATE.MENU)
          })
          .catch((error) => {
            console.error('Error loading assets:', error)
          })
      },
      update: () => {},
      render: () => {
        this.game.render()
      },
      exit: () => {},
    })

    // Playing
    this.addState(GAME_STATE.PLAYING, {
      enter: () => {},
      update: (deltaTime) => {
        if (this.game.esc.isDown) {
          this.setState(GAME_STATE.PAUSED)
          return
        }
        getScene().update(deltaTime)
        this.game.dialogManager.update(deltaTime)
        updateParticles()
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
