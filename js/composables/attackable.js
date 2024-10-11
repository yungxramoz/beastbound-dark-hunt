class Attackable {
  /**
   * Gives an entity the ability to attack
   * @param {Game} game - The game instance
   * @param {Entity} entity - The entity to attach the Attackable component to
   * @param {Object} options - The options for the Attackable component
   * @param {number} [options.attackDuration=1] - The duration of the attack in seconds
   * @param {number} [options.attackDamage=10] - The damage of the attack
   * @param {number} [options.hitRangeWidth=70] - The width of the hit range
   * @param {number} [options.hitRangeHeight=50] - The height of the hit range
   *
   * @throws {Error} - Game instance is required
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a Positionable component
   * @throws {Error} - Entity must have a flipX property
   */
  constructor(
    game,
    entity,
    {
      attackDuration = 1,
      attackDamage = 10,
      hitRangeWidth = 70,
      hitRangeHeight = 50,
    },
  ) {
    if (!game) throw new Error('Game instance is required')
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (!entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')

    this.game = game
    this.entity = entity

    this.attackDuration = attackDuration
    this.attackDamage = attackDamage
    this.hitRangeWidth = hitRangeWidth
    this.hitRangeHeight = hitRangeHeight
    this.isAttacking = false
    this.hitBox = null
  }

  /**
   * Gets the hit box for the attack
   * @returns {Object} - The hit box for the attack
   * @returns {number} x - The x-coordinate of the hit box
   * @returns {number} y - The y-coordinate of the hit box
   * @returns {number} width - The width of the hit box
   * @returns {number} height - The height of the hit box
   *
   */
  getHitBox() {
    const { x, y } = this.entity.position
    const { width, height } = this.entity

    const hitX = this.entity.flipX ? x - this.hitRangeWidth : x + width
    const hitY = y + (height - this.hitRangeHeight) / 2

    return {
      x: hitX,
      y: hitY,
      width: this.hitRangeWidth,
      height: this.hitRangeHeight,
    }
  }

  /**
   * Triggers the attack
   */
  hit() {
    if (!this.isAttacking) {
      this.isAttacking = true

      this.hitBox = this.getHitBox()
      console.log(
        `Attacked with hit box: x=${this.hitBox.x}, y=${this.hitBox.y}, width=${this.hitBox.width}, height=${this.hitBox.height}`,
      )

      setTimeout(() => {
        this.isAttacking = false
        this.hitBox = null
      }, this.attackDuration * 1000)
    }
  }

  /**
   * Draws the hit box for debugging purposes
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context
   */
  drawDebugHitBox(ctx) {
    if (!this.hitBox) return
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 2
    ctx.strokeRect(
      this.hitBox.x,
      this.hitBox.y,
      this.hitBox.width,
      this.hitBox.height,
    )
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Hit', this.hitBox.x, this.hitBox.y - 10)
  }
}

export default Attackable
