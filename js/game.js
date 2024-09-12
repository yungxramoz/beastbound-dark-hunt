import { Player } from './entities/characters/player.js'
import { Settlement } from './entities/environments/settlement.js'
import { ASSETS_SRC } from './constants/assets.js'
import { assets } from './library/utilities.js'

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = 1200
    this.canvas.height = 600

    this.fps = 60
    this.lastTime = 0
    this.gameRunning = false
    this.gameState = 'loading'

    Object.assign(this, assets)

    this.renderLoading()
    this.load(ASSETS_SRC).then(() => {
      console.log('All assets loaded successfully')
      this.startGame()
    })
  }

  startGame() {
    this.gameState = 'playing'
    this.gameRunning = true

    this.player = new Player(this, 100, 400)
    this.settlement = new Settlement(this)

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(currentTime) {
    if (!this.gameRunning) return

    const deltaTime = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    this.render()
    this.update(deltaTime)

    requestAnimationFrame(this.gameLoop.bind(this))
  }

  update(deltaTime) {
    if (this.gameState === 'playing') {
      this.player.update(deltaTime)
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    if (this.gameState === 'playing') {
      this.renderPlaying()
    } else if (this.gameState === 'loading') {
      this.renderLoading()
    }
  }

  renderPlaying() {
    this.settlement.draw()
    this.player.draw(this.ctx)
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
