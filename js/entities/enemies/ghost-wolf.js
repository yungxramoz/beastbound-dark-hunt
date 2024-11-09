import { addAuraParticles } from '../../components/particles.js'
import Attackable from '../../composables/attackable.js'
import Collidable from '../../composables/collidable.js'
import Damageable from '../../composables/damageable.js'
import Destructable from '../../composables/desctructable.js'
import Movable from '../../composables/movable.js'
import Positionable from '../../composables/positionable.js'
import Spriteable from '../../composables/spriteable.js'
import Statable from '../../composables/statable.js'
import { GHOST_WOLF_SPRITE } from '../../constants/ghost-wolf-sprite.js'
import { STYLE } from '../../constants/style.js'
import { addBorder, drawRect, drawText } from '../../display/ui.js'
import BeastStateMachine from '../../states/beast-state-machine.js'
import { getGroundY } from '../../utils/boundaries.js'
import { getId } from '../../utils/id.js'

class GhostWolf {
  constructor(game, player, x, y, lvl = 1) {
    this.id = getId()
    this.game = game
    this.player = player

    this.width = 140
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
      spriteOffsetX: -40,
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
      hitRangeWidth: 30,
      hitRangeHeight: 30,
      damage: 10 + this.stats.strength(),
    })
    this.damage = new Damageable(this, {
      health: this.stats.maxHealth(),
      bloodColor: 'rgba(251,106,255,0.8)',
    })
    this.destruct = new Destructable(this)
    this.collide = new Collidable(this)
    this.stateMachine = new BeastStateMachine(this, this.player)
    this.buff = {}
  }

  modifyStatsByLevel(lvl) {
    this.stats.addAgi(lvl)
    this.stats.addStr(lvl)
    this.stats.addDef(lvl)
    this.stats.addCon(lvl)
  }

  addBuff(name, { agi, str, def, con, duration }) {
    this.buff[name] = { agi, str, def, con }

    if (agi) this.stats.addAgi(agi)
    if (str) this.stats.addStr(str)
    if (def) this.stats.addDef(def)
    if (con) this.stats.addCon(con)

    setTimeout(() => {
      this.removeBuff(name)
    }, duration * 1000)
  }

  removeBuff(name) {
    if (!this.buff[name]) return

    const { agi, str, def, con } = this.buff[name]

    if (agi) this.stats.addAgi(-agi)
    if (str) this.stats.addStr(-str)
    if (def) this.stats.addDef(-def)
    if (con) this.stats.addCon(-con)

    delete this.buff[name]
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.collide.update()
    this.move.update()
    this.sprite.update(deltaTime)
  }

  draw(ctx) {
    this.sprite.draw(ctx)
    this.sprite.drawShadow(ctx)
    if (Object.keys(this.buff).length > 0) {
      addAuraParticles(this, 'rgba(246, 240, 128, 0.5)')
    }
  }

  drawForeground(ctx) {
    this.drawHud(ctx)
  }

  drawHud(ctx) {
    const { health } = this.damage
    const maxHealth = this.stats.maxHealth()
    const healthBarWidth = 600
    const healthBarHeight = 20

    //bottom center of screen
    const healthBarX = this.game.canvas.width / 2 - healthBarWidth / 2
    const healthBarY = this.game.canvas.height - healthBarHeight - 15

    const healthBarPadding = 2
    const healthBarInnerWidth = (health / maxHealth) * healthBarWidth

    //draw ghost wolf text
    drawText(ctx, 'Ghost Wolf', healthBarX, healthBarY - 20)

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

    drawText(
      ctx,
      `${health.toFixed(0)}/${maxHealth}`,
      healthBarX + 5,
      healthBarY + healthBarHeight + 5,
      {
        size: 8,
      },
    )
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

    this.attack.drawDebugHitLocation(ctx)
  }
}

export default GhostWolf
