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
    this.frameDuration = 1000 / this.fps
    this.lastTime = 0
    this.accumulatedTime = 0
    this.gameRunning = false
    this.gameState = 'loading'

    this.debug = true

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

    if (this.debug) {
      this.renderDebugInfo()
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

  renderDebugInfo() {
    //add transparent box
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.fillRect(0, 0, 200, 180)

    this.ctx.font = '15px Arial'
    this.ctx.fillStyle = 'white'
    this.ctx.fillText(
      `Player X: ${this.player.x.toFixed(2)} Y: ${this.player.y.toFixed(2)}`,
      10,
      20,
    )
    this.ctx.fillText(`Player SpeedX: ${this.player.speedX.toFixed(2)}`, 10, 40)
    this.ctx.fillText(`Player SpeedY: ${this.player.speedY.toFixed(2)}`, 10, 60)
    this.ctx.fillText(`Player isGrounded: ${this.player.isGrounded}`, 10, 80)
    this.ctx.fillText(`Player isMoving: ${this.player.isMoving}`, 10, 100)
    this.ctx.fillText(`Player isAttacking: ${this.player.isAttacking}`, 10, 120)
    this.ctx.fillText(
      `Player state: ${this.player.stateMachine.currentState}`,
      10,
      140,
    )

    //current fps game is running at
    this.ctx.fillText(
      `FPS: ${Math.round(1 / (this.frameDuration / 1000))}`,
      10,
      160,
    )
  }
}

new Game('gameCanvas')
