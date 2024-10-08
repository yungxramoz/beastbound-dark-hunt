import { getGroundY } from '../utils/bounderies.js'

class Movable {
  constructor(game, entity, { moveSpeed, jumpSpeed, gravity }) {
    if (!game) throw new Error('Game is required')
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')

    this.game = game
    this.entity = entity

    this.maxSpeed = moveSpeed
    this.jumpSpeed = jumpSpeed
    this.gravity = gravity

    this.groundY = getGroundY(this.entity.height)
    this.speedX = 0
    this.speedY = 0
  }

  left() {
    this.speedX = -this.maxSpeed
  }

  right() {
    this.speedX = this.maxSpeed
  }

  stop() {
    this.speedX = 0
  }

  jump() {
    if (this.entity.position.isGrounded()) {
      this.speedY = -this.jumpSpeed
    }
  }

  dash() {
    this.speedX = this.maxSpeed * 2
  }

  faceTowards(target) {
    if (!target.position)
      throw new Error('Entity must have a Positionable component')

    if (
      target.position.x <
      this.entity.position.x
    ) {
      this.entity.flipX = true
    } else {
      this.entity.flipX = false
    }
  }

  isFalling() {
    return this.speedY > 0
  }

  update() {
    if (
      (this.speedX > 0 && !this.entity.position.isOutOfBoundsRight()) ||
      (this.speedX < 0 && !this.entity.position.isOutOfBoundsLeft())
    ) {
      this.entity.position.x += this.speedX
    }

    if (!this.entity.position.isGrounded()) {
      this.speedY += this.gravity
    }

    this.entity.position.setPosition(null, this.entity.position.y + this.speedY)
    if (this.entity.position.y >= this.groundY) {
      this.entity.position.setPosition(null, this.groundY)
      this.speedY = 0
    }
  }
}

export default Movable
