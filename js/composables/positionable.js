import {
  getGroundY,
  isOutOfBoundsLeft,
  isOutOfBoundsRight,
} from '../utils/boundaries.js'

class Positionable {
  /**
   * Gives an entity the ability to be positioned on the screen
   * @param {Entity} entity - The entity to attach the Positionable component to
   * @param {Object} options - The options for the Positionable component
   * @param {number} options.offsetX - The x offset of the entity
   * @param {number} options.offsetY - The y offset of the entity
   * @param {number} options.x - The x position of the entity
   * @param {number} options.y - The y position of the entity
   *
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a width property
   * @throws {Error} - Entity must have a height property
   */
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

  /**
   * Sets the position of the entity
   * @param {number} x - The x position of the entity
   * @param {number} y - The y position of the entity
   */
  setPosition(x, y) {
    if (x !== null) {
      this.x = x + this.offsetX
    }
    if (y !== null) {
      this.y = y + this.offsetY
    }
  }

  /**
   * Checks if the entity is out of bounds on the left
   * @returns {boolean} - Returns true if the entity is out of bounds on the left side
   */
  isOutOfBoundsLeft() {
    return isOutOfBoundsLeft(this.x)
  }

  /**
   * Checks if the entity is out of bounds on the right
   * @returns {boolean} - Returns true if the entity is out of bounds on the right side
   */
  isOutOfBoundsRight() {
    return isOutOfBoundsRight(this.x, this.entity.width)
  }

  /**
   * Checks if the entity is on the ground
   * @returns {boolean} - Returns true if the entity is on the ground
   */
  isGrounded() {
    return this.y === getGroundY(this.entity.height)
  }
}

export default Positionable
