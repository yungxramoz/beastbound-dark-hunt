import {
  getGroundY,
  isOutOfBoundsLeft,
  isOutOfBoundsRight,
} from '../utils/bounderies.js'

export const Movable = (width, height, offsetX) => ({
  offsetX: offsetX || 0,
  speedX: 0,
  speedY: 0,
  maxSpeed: 5,
  jumpSpeed: 15,
  gravity: 0.8,
  groundY: getGroundY(height),
  width: width || 0,
  isGrounded: true,
  isMoving: false,
  isFalling: false,

  moveLeft() {
    this.speedX = -this.maxSpeed
    this.isMoving = true
  },

  moveRight() {
    this.speedX = this.maxSpeed
    this.isMoving = true
  },

  stopMoving() {
    this.speedX = 0
    this.isMoving = false
  },

  jump() {
    if (this.isGrounded) {
      this.speedY = -this.jumpSpeed
      this.isGrounded = false
      this.isMoving = false
    }
  },

  updateMovement() {
    if (!this.isGrounded) {
      this.speedY += this.gravity
      if (this.speedY >= 0) {
        this.isFalling = true
      }
    }

    if (isOutOfBoundsLeft(this.x + offsetX) && this.speedX < 0) {
      this.stopMoving()
    } else if (
      isOutOfBoundsRight(this.x + offsetX, this.width) &&
      this.speedX > 0
    ) {
      this.stopMoving()
    } else {
      this.x += this.isGrounded ? this.speedX : this.speedX * 0.9
    }

    this.y += this.speedY

    if (this.y >= this.groundY) {
      this.y = this.groundY
      this.speedY = 0
      this.isFalling = false
      this.isGrounded = true
      this.isMoving = this.speedX !== 0
    }
  },
})
