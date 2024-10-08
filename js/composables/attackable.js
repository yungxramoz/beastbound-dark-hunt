class Attackable {
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
