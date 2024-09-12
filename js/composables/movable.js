export const Movable = () => ({
  speedX: 0,
  speedY: 0,
  maxSpeed: 5,
  jumpSpeed: 15,
  gravity: 0.8,
  groundY: 390,
  isGrounded: true,
  isMoving: false,

  moveLeft() {
    this.speedX = -this.maxSpeed
    this.isMoving = true
    console.log('Moving left')
  },

  moveRight() {
    this.speedX = this.maxSpeed
    this.isMoving = true
    console.log('Moving right')
  },

  stopMoving() {
    this.speedX = 0
    this.isMoving = false
    console.log('Stopped moving')
  },

  jump() {
    if (this.isGrounded) {
      this.speedY = -this.jumpSpeed
      this.isGrounded = false
      this.isMoving = false
      console.log('Jumped')
    }
  },

  updateMovement() {
    if (!this.isGrounded) {
      this.speedY += this.gravity
    }

    this.x += this.isGrounded ? this.speedX : this.speedX * 0.9
    this.y += this.speedY

    if (this.y >= this.groundY) {
      this.y = this.groundY
      this.speedY = 0
      this.isGrounded = true
      this.isMoving = this.speedX !== 0
    }
  },
})
