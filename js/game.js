import { drawParticles } from './components/particles.js'
import { BOUNDARIES } from './constants/positions.js'
import DialogManager from './display/dialog-manager.js'
import Dialog from './display/dialog.js'
import { drawText } from './display/ui.js'
import { keyboard } from './library/interactive.js'
import { assets } from './library/utilities.js'
import GameStateMachine, { GAME_STATE } from './states/game-state-machine.js'
import { getScene } from './store/scene-data.js'
import { makePointer } from './utils/mouse-handler.js'

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = BOUNDARIES.GAME_WIDTH
    this.canvas.height = BOUNDARIES.GAME_HEIGHT

    this.fps = 60
    this.frameDuration = 1000 / this.fps
    this.lastTime = 0
    this.accumulatedTime = 0

    // Initialize dialog manager
    this.dialogManager = new DialogManager(this)

    // Initialize pointer and global key
    this.pointer = makePointer(this.canvas)
    this.esc = keyboard('Escape')

    // Load assets
    this.assets = assets

    this.stateMachine = new GameStateMachine(this)
  }

  start() {
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  gameLoop(currentTime) {
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    this.accumulatedTime += deltaTime

    while (this.accumulatedTime >= this.frameDuration) {
      this.stateMachine.update(this.frameDuration / 1000)
      this.accumulatedTime -= this.frameDuration
    }

    this.stateMachine.render()
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  pauseGame() {
    const dialog = new Dialog(this, {
      title: 'Game Paused',
      dialogHeight: 200,
      dialogWidth: 400,
      onClose: () => {
        this.stateMachine.setState(GAME_STATE.PLAYING)
      },
      buttons: [
        {
          text: 'Resume',
          onClick: () => {
            dialog.close()
          },
          width: 220,
          height: 40,
        },
      ],
    })

    this.dialogManager.openDialog(dialog)
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    getScene().draw(this.ctx)
    this.dialogManager.draw(this.ctx)
    drawParticles(this.ctx)
  }

  renderLoading() {
    drawText(
      this.ctx,
      'Loading...',
      this.canvas.width / 2,
      this.canvas.height / 2,
      {
        size: 30,
        font: 'Arial',
        align: 'center',
      },
    )
  }
}

new Game('gameCanvas')
