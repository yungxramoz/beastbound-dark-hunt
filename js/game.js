import { Player } from './entities/characters/player.js'
import { Settlement } from './entities/environments/settlement.js'
import { ASSETS_SRC } from './constants/assets.js'
import { assets } from './library/utilities.js'
import { BOUNDERIES } from './constants/positions.js'
import { SETTINGS } from './constants/settings.js'
import { SettlementScene } from './scenes/settlement-scene.js'
import GAME_STATE from './constants/game-state.js'

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = BOUNDERIES.GAME_WIDTH
    this.canvas.height = BOUNDERIES.GAME_HEIGHT

    this.fps = 60
    this.frameDuration = 1000 / this.fps
    this.lastTime = 0
    this.accumulatedTime = 0
    this.gameRunning = false
    this.gameState = GAME_STATE.LOADING

    Object.assign(this, assets)

    this.renderLoading()
    this.load(ASSETS_SRC).then(() => {
      console.log('All assets loaded successfully')
      this.startGame()
    })
  }

  startGame() {
    this.gameState = GAME_STATE.PLAYING
    this.gameRunning = true

    this.scene = new SettlementScene(this)

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(currentTime) {
    if (!this.gameRunning) return

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    this.accumulatedTime += deltaTime

    while (this.accumulatedTime >= this.frameDuration) {
      this.update(this.frameDuration / 1000)
      this.render()
      this.accumulatedTime -= this.frameDuration
    }

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  update(deltaTime) {
    if (this.gameState === GAME_STATE.PLAYING) {
      this.scene.update(deltaTime)
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.gameState === GAME_STATE.PLAYING) {
      this.renderPlaying()
    } else if (this.gameState === GAME_STATE.LOADING) {
      this.renderLoading()
    }
  }

  renderPlaying() {
    this.scene.draw(this.ctx)
  }

  renderLoading() {
    this.ctx.font = '30px Arial'
    this.ctx.fillStyle = 'black'
    this.ctx.fillText(
      'Loading...',
      this.canvas.width / 2 - 75,
      this.canvas.height / 2,
    )
  }
}

new Game('gameCanvas')
