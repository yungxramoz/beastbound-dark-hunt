import Character from '../../components/character.js'
import Attackable from '../../composables/attackable.js'
import { SETTINGS } from '../../constants/settings.js'
import { keyboard } from '../../library/interactive.js'
import PlayerStateMachine from '../../states/player-state-machine.js'
import { getDistance, isFacingTowards } from '../../utils/collision.js'
import { addBorder, drawRect, drawText } from '../../display/ui.js'

class Player extends Character {
  constructor(game, x, y) {
    super(game, {
      x,
      y,
      spriteScale: 1.7,
      width: 85,
      height: 95,
      offsetX: 55,
      offsetY: 0,
      spriteOffsetX: -65,
      spriteOffsetY: -25,
      baseShadowWidth: 70,
    })

    this.game = game
    this.isInteracting = false
    this.currentInteractable = null

    this.attack = new Attackable(game, this, {
      attackDuration: 0.6,
      attackDamage: 10,
      hitRangeWidth: 70,
      hitRangeHeight: 50,
    })

    this.leftArrow = keyboard('ArrowLeft')
    this.a = keyboard('a')
    this.rightArrow = keyboard('ArrowRight')
    this.d = keyboard('d')
    this.j = keyboard('j')
    this.e = keyboard('e')
    this.space = keyboard(' ')

    this.stateMachine = new PlayerStateMachine(this)
  }

  checkForInteraction() {
    const interactables = this.game.interactables || []
    let nearestInteractable = null
    let minDistance = Infinity

    for (const interactable of interactables) {
      const distance = getDistance(
        this.position.x,
        this.position.y,
        interactable.position.x,
        interactable.position.y,
      )

      if (
        distance <= interactable.interaction.radius &&
        isFacingTowards(this, interactable) &&
        distance < minDistance
      ) {
        minDistance = distance
        nearestInteractable = interactable
      }
    }

    if (nearestInteractable) {
      const interactable = nearestInteractable.interaction

      if (!interactable.isInteracting) {
        interactable.start(this)
        this.isInteracting = true
        this.currentInteractable = interactable
      }
    }
  }

  onInteractionEnd() {
    this.isInteracting = false
    this.currentInteractable = null
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    super.update(deltaTime)
  }

  draw(ctx) {
    super.draw(ctx)
    if (SETTINGS.DEBUG) {
      this.drawDebugInfo(ctx)
      this.attack.drawDebugHitBox(ctx)
    }
  }

  drawDebugInfo(ctx) {
    drawRect(ctx, 0, 0, 230, 100, 'rgba(0, 0, 0, 0.5)')
    drawText(ctx, 'Player', 10, 10, {
      size: 10,
    })
    drawText(ctx, `SpeedX: ${this.move.speedX.toFixed(2)}`, 10, 40, {
      size: 8,
    })
    drawText(ctx, `SpeedY: ${this.move.speedY.toFixed(2)}`, 10, 60, {
      size: 8,
    })
    drawText(ctx, `State: ${this.stateMachine.currentState}`, 10, 80, {
      size: 8,
    })

    addBorder(ctx, this.position.x, this.position.y, this.width, this.height, {
      border: 'red',
    })
    const text = `Player X: ${this.position.x.toFixed(
      2,
    )} Y: ${this.position.y.toFixed(2)}`
    const textWidth = ctx.measureText(text).width
    const textX = this.position.x + this.width / 2 - textWidth / 2

    drawText(ctx, text, textX, this.position.y - 20, {
      size: 8,
    })
  }
}

export default Player
