import Character from '../../components/character.js'
import Attackable from '../../composables/attackable.js'
import Collidable from '../../composables/collidable.js'
import Damageable from '../../composables/damageable.js'
import Statable from '../../composables/statable.js'
import { STYLE } from '../../constants/style.js'
import { addBorder, drawRect, drawText } from '../../display/ui.js'
import { keyboard } from '../../library/interactive.js'
import PlayerStateMachine from '../../states/player-state-machine.js'
import {
  getInteractablesData,
  setCurrentInteractable,
} from '../../store/interactables-data.js'
import { getDistance, isFacingTowards } from '../../utils/collision.js'

class Player extends Character {
  constructor(game, x, y) {
    super(game, {
      x,
      y,
      spriteScale: 1.7,
      width: 40,
      height: 80,
      offsetX: 55,
      offsetY: 0,
      spriteOffsetX: -85,
      spriteOffsetY: -42,
      baseShadowWidth: 70,
    })

    this.game = game
    this.isInteracting = false

    this.stats = new Statable(game, this)
    this.attack = new Attackable(game, this, {
      attackDuration: 0.6,
      hitTime: 0,
      hitDuration: 0.3,
      hitRangeWidth: 120,
      hitRangeHeight: 60,
      damage: 2 + this.stats.strength(),
    })
    this.damage = new Damageable(this, { health: this.stats.maxHealth() })
    this.collide = new Collidable(this)

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
    const interactables = getInteractablesData() || []
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
        setCurrentInteractable(interactable)
      }
    }
  }

  onInteractionEnd() {
    this.isInteracting = false
    setCurrentInteractable(null)
  }

  drawHud(ctx) {
    const { health } = this.damage
    const maxHealth = this.stats.maxHealth()

    const healthBarWidth = 250
    const healthBarHeight = 10
    const healthBarX = 30
    const healthBarY = 30
    const healthBarPadding = 1
    const healthBarInnerWidth = (health / maxHealth) * healthBarWidth

    drawText(ctx, 'Hunter', healthBarX, healthBarY - 18, {
      size: 10,
    })

    drawRect(
      ctx,
      healthBarX,
      healthBarY,
      healthBarWidth,
      healthBarHeight,
      STYLE.COLORS.PRIMARY_LIGHTER_1,
    )

    addBorder(ctx, healthBarX, healthBarY, healthBarWidth, healthBarHeight)

    if (health > 0) {
      drawRect(
        ctx,
        healthBarX + healthBarPadding,
        healthBarY + healthBarPadding,
        healthBarInnerWidth - healthBarPadding * 2,
        healthBarHeight - healthBarPadding * 2,
        STYLE.COLORS.RED,
      )
    }

    // draw health text
    drawText(
      ctx,
      `${health.toFixed(0)}/${maxHealth}`,
      healthBarX + 5,
      healthBarY + healthBarHeight + 8,
      {
        size: 6,
      },
    )
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.collide.update()
    super.update(deltaTime)
  }

  draw(ctx) {
    super.draw(ctx)
  }

  drawForeground(ctx) {
    this.drawHud(ctx)
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

    this.attack.drawDebugHitLocation(ctx)
  }
}

export default Player
