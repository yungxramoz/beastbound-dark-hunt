import Character from '../../components/character.js'
import Attackable from '../../composables/attackable.js'
import Damageable from '../../composables/damageable.js'
import Movable from '../../composables/movable.js'
import Positionable from '../../composables/positionable.js'
import Spriteable from '../../composables/spriteable.js'
import Statable from '../../composables/statable.js'
import { GHOST_WOLF_SPRITE } from '../../constants/ghost-wolf-sprite.js'
import { BOUNDARIES } from '../../constants/positions.js'
import { addBorder, drawRect, drawText } from '../../display/ui.js'
import BeastStateMachine from '../../states/beast-state-machine.js'
import { getGroundY } from '../../utils/boundaries.js'

class GhostWolf {
  constructor(game, player, x, y, lvl = 1) {
    this.game = game
    this.player = player

    this.width = 170
    this.height = 90

    this.flipX = true

    this.position = new Positionable(this, {
      offsetX: 0,
      offsetY: 0,
      x,
      y: getGroundY(this.height),
    })
    this.move = new Movable(game, this, {
      moveSpeed: 2.5,
      jumpSpeed: 10,
      gravity: 0.5,
    })
    this.sprite = new Spriteable(game, this, {
      spriteScale: 2.5,
      spriteOffsetX: -35,
      spriteOffsetY: -60,
      hasShadow: true,
      baseShadowWidth: 180,
      spriteFlipped: true,
    })
    this.stats = new Statable(game, this)

    this.modifyStatsByLevel(lvl)

    const { frameTime, numFrames } = GHOST_WOLF_SPRITE.ATTACKING

    this.attack = new Attackable(game, this, {
      attackDuration: frameTime * numFrames,
      hitRangeWidth: 15,
      hitRangeHeight: 30,
    })
    this.damageable = new Damageable(this.stats.maxHealth())

    const patrolPoints = [
      { x: 100, y },
      { x: BOUNDARIES.GAME_WIDTH - 100, y },
    ]

    this.stateMachine = new BeastStateMachine(this, this.player, patrolPoints)
  }

  modifyStatsByLevel(lvl) {
    this.stats.addAgi(lvl)
    this.stats.addStr(lvl)
    this.stats.addDef(lvl)
    this.stats.addCon(lvl)
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.move.update()
    this.sprite.update(deltaTime)
  }

  draw(ctx) {
    this.sprite.draw(ctx)
    this.sprite.drawShadow(ctx)
  }

  drawDebugInfo(ctx) {
    const { x, y } = this.position
    const { width, height } = this
    const { speedX, speedY } = this.move
    const { currentState } = this.stateMachine

    drawRect(ctx, 240, 0, 230, 100, 'rgba(0, 0, 0, 0.5)')
    drawText(ctx, 'Wolf', 250, 10, {
      size: 10,
    })
    drawText(ctx, `SpeedX: ${speedX.toFixed(2)}`, 250, 40, {
      size: 8,
    })
    drawText(ctx, `SpeedY: ${speedY.toFixed(2)}`, 250, 60, {
      size: 8,
    })
    drawText(ctx, `State: ${currentState}`, 250, 80, {
      size: 8,
    })

    addBorder(ctx, x, y, width, height, {
      border: 'red',
    })
    const text = `Wolf X: ${x.toFixed(2)} Y: ${y.toFixed(2)}`
    const textWidth = ctx.measureText(text).width
    const textX = x + width / 2 - textWidth / 2

    drawText(ctx, text, textX, y - 20, {
      size: 8,
    })

    this.attack.drawDebugHitBox(ctx)
  }
}

export default GhostWolf
