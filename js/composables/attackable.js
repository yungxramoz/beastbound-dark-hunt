import { getDamageableData } from '../store/damageables-data.js'

class Attackable {
  /**
   * Gives an entity the ability to attack
   * @param {Game} game - The game instance
   * @param {Entity} entity - The entity to attach the Attackable component to
   * @param {Object} options - The options for the Attackable component
   * @param {number} [options.attackDuration=1] - The duration of the attack in seconds
   * @param {number} [options.hitRangeWidth=70] - The width of the hit range
   * @param {number} [options.hitRangeHeight=50] - The height of the hit range
   * @param {number} [options.hitTime=0.5] - The time after which the hit is registered
   * @param {number} [options.hitDuration=0.5] - The duration to display the hit location
   *
   * @throws {Error} - Game instance is required
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a Positionable component
   * @throws {Error} - Entity must have a flipX property
   * @throws {Error} - Entity must have a stats property
   */
  constructor(
    game,
    entity,
    {
      attackDuration = 1,
      hitRangeWidth = 70,
      hitRangeHeight = 50,
      hitTime = 0.5,
      hitDuration = 0.5,
      damage = 1,
    },
  ) {
    if (!game) throw new Error('Game instance is required')
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')
    if (entity.stats === undefined)
      throw new Error('Entity must have a stats property')

    this.game = game
    this.entity = entity

    this.attackDuration = attackDuration
    this.hitRangeWidth = hitRangeWidth
    this.hitRangeHeight = hitRangeHeight
    this.isAttacking = false
    this.hitLocation = null
    this.hitTime = hitTime
    this.hitDuration = hitDuration
    this.damage = damage
  }

  /**
   * Gets the hit location for the attack
   * @returns {Object} - The hit location for the attack
   * @returns {number} x - The x-coordinate of the hit location
   * @returns {number} y - The y-coordinate of the hit location
   */
  getHitLocation() {
    const { x, y } = this.entity.position
    const { width, height } = this.entity

    const hitX = this.entity.flipX
      ? x - this.hitRangeWidth / 2
      : x + width + this.hitRangeWidth / 2
    const hitY = y + height / 2

    return {
      x: hitX,
      y: hitY,
    }
  }

  /**
   * Triggers the attack
   */
  hit() {
    if (this.isAttacking) return

    this.isAttacking = true
    this.hitLocation = null

    const damageables = getDamageableData()

    setTimeout(() => {
      this.hitLocation = this.getHitLocation()

      damageables.forEach((target) => {
        if (target.id === this.entity.id) return

        const { x, y } = this.hitLocation
        const { width, height } = target
        const { x: targetX, y: targetY } = target.position

        if (
          x >= targetX &&
          x <= targetX + width &&
          y >= targetY &&
          y <= targetY + height
        ) {
          target.damage.dealDamage(this.damage)
        }
      })

      setTimeout(() => {
        this.hitLocation = null
      }, this.hitDuration * 1000)
    }, this.hitTime * 1000)

    setTimeout(() => {
      this.isAttacking = false
    }, this.attackDuration * 1000)
  }

  /**
   * Draws the hit location for debugging purposes
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   */
  drawDebugHitLocation(ctx) {
    if (!this.hitLocation) return
    const { x, y } = this.hitLocation

    ctx.save()
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x - 5, y - 5)
    ctx.lineTo(x + 5, y + 5)
    ctx.moveTo(x + 5, y - 5)
    ctx.lineTo(x - 5, y + 5)
    ctx.stroke()
    ctx.restore()
  }
}

export default Attackable
