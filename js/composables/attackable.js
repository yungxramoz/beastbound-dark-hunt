import { SETTINGS } from '../constants/settings.js'

export const Attackable = (
  attackDuration,
  attackDamage,
  width,
  height,
  offsetX,
  offsetY,
  hitRangeWidth,
  hitRangeHeight,
) => ({
  attackDuration: attackDuration || 1,
  attackDamage: attackDamage || 10,
  width: width || 0,
  height: height || 0,
  offsetX: offsetX || 0,
  offsetY: offsetY || 0,
  hitRangeWidth: hitRangeWidth || 70,
  hitRangeHeight: hitRangeHeight || 50,
  isAttacking: false,
  hitBox: null,

  getHitBox() {
    const hitX = this.flipX
      ? this.x + this.offsetX - this.hitRangeWidth
      : this.x + this.offsetX + this.width
    const hitY = this.y + this.offsetY + (this.height - this.hitRangeHeight) / 2

    return {
      x: hitX,
      y: hitY,
      width: this.hitRangeWidth,
      height: this.hitRangeHeight,
    }
  },

  attack() {
    if (!this.isAttacking) {
      this.isAttacking = true

      this.hitBox = this.getHitBox()
      console.log(
        `Attacked with hit box: x=${this.hitBox.x}, y=${this.hitBox.y}, width=${this.hitBox.width}, height=${this.hitBox.height}`,
      )

      setTimeout(() => {
        this.isAttacking = false
        this.hitBox = null
        console.log('Attack finished')
      }, this.attackDuration * 1000)
    }
  },

  drawDebugHitBox(context) {
    if (!this.hitBox) return
    context.strokeStyle = 'blue'
    context.lineWidth = 2
    context.strokeRect(
      this.hitBox.x,
      this.hitBox.y,
      this.hitBox.width,
      this.hitBox.height,
    )
    context.font = '12px Arial'
    context.fillStyle = 'white'
    context.fillText('Hit', this.hitBox.x, this.hitBox.y - 10)
  },
})
