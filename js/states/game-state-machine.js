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

  setupStates() {
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
        this.game.gameLoop(0)
      },
      update: (deltaTime) => {
        if (this.game.esc.isDown) {
          this.setState(GAME_STATE.PAUSED)
        } else {
          this.game.scene.update(deltaTime)
          this.game.dialogManager.update(deltaTime)

          this.game.renderPlaying()
          this.game.dialogManager.draw(this.game.ctx)
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
        this.game.ctx.clearRect(
          0,
          0,
          this.game.canvas.width,
          this.game.canvas.height,
        )

        this.game.dialogManager.update(deltaTime)
        this.game.scene.draw(this.game.ctx)
        this.game.dialogManager.draw(this.game.ctx)
      },
      exit: () => {},
    })
  }
}

export default GameStateMachine
export { GAME_STATE }
