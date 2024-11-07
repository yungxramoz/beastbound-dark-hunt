import { getGroundY } from '../utils/boundaries.js'

class Movable {
  /**
   * Gives an entity the ability to move and jump
   * @param {Game} game - The game instance
   * @param {Entity} entity - The entity to attach the Movable component to
   * @param {Object} options - The options for the Movable component
   * @param {number} options.moveSpeed - The speed at which the entity moves
   * @param {number} options.jumpSpeed - The speed at which the entity jumps
   * @param {number} options.gravity - The gravity that affects the entity
   *
   * @throws {Error} - Game is required
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a Positionable component   *
   */
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

  /**
   * Moves the entity left
   */
  left() {
    this.speedX = -this.maxSpeed
  }

  /**
   * Moves the entity right
   */
  right() {
    this.speedX = this.maxSpeed
  }

  /**
   * Stops the entity from moving
   */
  stop() {
    this.speedX = 0
    if (this.sound) {
      this.sound.pause()
    }
  }

  /**
   * Makes the entity jump
   */
  jump() {
    if (this.entity.position.isGrounded()) {
      this.speedY = -this.jumpSpeed
    }
  }

  /**
   * Checks if the entity is falling
   */
  isFalling() {
    return this.speedY > 0
  }

  /**
   * Makes the entity face towards a target entity
   * @param {Entity} target - The entity to face towards
   * @throws {Error} - Entity must have a Positionable component
   */
  faceTowards({ x }) {
    if (x === undefined) throw new Error('FaceTowards requires an x position')

    if (x < this.entity.position.x) {
      this.entity.flipX = true
    } else {
      this.entity.flipX = false
    }
  }

  moveTo({ x, y }) {
    if (x === undefined || y === undefined)
      throw new Error('MoveTo requires an x and y position')

    if (x < this.entity.position.x) {
      this.left()
    } else {
      this.right()
    }
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
