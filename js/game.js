import { ASSETS_SRC } from './constants/assets.js'
import { BOUNDERIES } from './constants/positions.js'
import ForestScene from './entities/scenes/forest-scene.js'
import SettlementScene from './entities/scenes/settlement-scene.js'
import { assets } from './library/utilities.js'
import { GAME_STATE } from './states/game-state-machine.js'
import DialogManager from './utils/dialog-manager.js'
import { drawText } from './utils/ui.js'

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
    this.gameState = GAME_STATE.LOADING

    this.assets = assets

    // Initialize mouse input
    this.mouse = {
      x: 0,
      y: 0,
      isPressed: false,
    }

    // Initialize dialog manager
    this.dialogManager = new DialogManager(this)
    this.interaction = {
      isInteracting: false,
      entity: null,
    }

    this.setupMouseListeners()

    this.renderLoading()
    this.assets.load(ASSETS_SRC).then(() => {
      console.log('All assets loaded successfully')
      this.startGame()
    })
  }

  setupMouseListeners() {
    this.canvas.addEventListener('mousemove', (event) => {
      const rect = this.canvas.getBoundingClientRect()

      // handle scaling
      const scaleX = this.canvas.width / rect.width
      const scaleY = this.canvas.height / rect.height

      this.mouse.x = (event.clientX - rect.left) * scaleX
      this.mouse.y = (event.clientY - rect.top) * scaleY
    })

    this.canvas.addEventListener('mousedown', () => {
      this.mouse.isPressed = true
    })

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.isPressed = false
    })
  }

  startGame() {
    this.gameState = GAME_STATE.PLAYING
    this.scene = new SettlementScene(this)
    // this.scene = new ForestScene(this)

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(currentTime) {
    if (this.gameState !== GAME_STATE.PLAYING) return

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    this.accumulatedTime += deltaTime

    while (this.accumulatedTime >= this.frameDuration) {
      this.update(this.frameDuration / 1000)
      this.accumulatedTime -= this.frameDuration
    }

    this.render()

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  update(deltaTime) {
    if (this.gameState === GAME_STATE.PLAYING) {
      this.scene.update(deltaTime)
    }

    // Update dialog manager
    this.dialogManager.update(deltaTime)
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.gameState === GAME_STATE.PLAYING) {
      this.renderPlaying()
    } else if (this.gameState === GAME_STATE.LOADING) {
      this.renderLoading()
    }

    // Draw dialog manager (on top of other elements)
    this.dialogManager.draw(this.ctx)
  }

  renderPlaying() {
    this.scene.draw(this.ctx)
  }

  renderLoading() {
    drawText(
      this.ctx,
      'Loading...',
      this.canvas.width / 2 - 75,
      this.canvas.height / 2,
      {
        size: 30,
        font: 'Arial',
      },
    )
  }
}

new Game('gameCanvas')
