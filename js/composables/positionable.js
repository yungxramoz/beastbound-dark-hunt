import {
  getGroundY,
  isOutOfBoundsLeft,
  isOutOfBoundsRight,
} from '../utils/bounderies.js'

class Positionable {
  constructor(entity, { offsetX, offsetY, x = 0, y = 0 }) {
    if (!entity) throw new Error('Entity is required')
    if (!entity.width) throw new Error('Entity must have a width property')
    if (!entity.height) throw new Error('Entity must have a height property')

    this.entity = entity

    this.offsetX = offsetX
    this.offsetY = offsetY
    this.x = x + this.offsetX
    this.y = y + this.offsetY
  }

  setPosition(x, y) {
    if (x !== null) {
      this.x = x + this.offsetX
    }
    if (y !== null) {
      this.y = y + this.offsetY
    }
  }

  isOutOfBoundsLeft() {
    return isOutOfBoundsLeft(this.x)
  }

  isOutOfBoundsRight() {
    return isOutOfBoundsRight(this.x, this.entity.width)
  }

  isGrounded() {
    return this.y === getGroundY(this.entity.height)
  }
}

export default Positionable
