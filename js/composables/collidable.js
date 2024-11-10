import {
  getCollidableData,
  setCollidableData,
} from '../store/collidable-data.js'
import { areRectanglesOverlapping } from '../utils/collision.js'

class Collidable {
  /**
   * Adds collision detection to an entity
   * @param {Entity} entity - The entity to add collision detection to
   * @param {Object} options - Collision options
   * @param {boolean} [options.isStatic=false] - If true, the entity doesn't move upon collision
   */
  constructor(entity, { isStatic = false } = {}) {
    if (!entity) throw new Error('Collidable requires an entity')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')

    this.entity = entity
    this.isStatic = isStatic

    // Add this collidable entity to the collidable data store
    setCollidableData(this.entity.id, this.entity)
  }

  /**
   * Checks if this entity is colliding with another
   * @param {Collidable} other - The other collidable entity
   * @returns {boolean} - True if colliding, else false
   */
  checkCollision(other) {
    const rect1 = {
      x: this.entity.position.x,
      y: this.entity.position.y,
      width: this.entity.width,
      height: this.entity.height,
    }

    const rect2 = {
      x: other.position.x,
      y: other.position.y,
      width: other.width,
      height: other.height,
    }

    return areRectanglesOverlapping(rect1, rect2)
  }

  /**
   * Handles collision with another entity
   * @param {Collidable} other - The other collidable entity
   */
  handleCollision(other) {
    if (this.isStatic) return

    if (!this.entity.position.isGrounded() || !other.position.isGrounded()) {
      return
    }

    // Simple collision response: stop movement and adjust position
    if (
      this.entity.move &&
      this.entity.position.isGrounded() &&
      other.position.isGrounded()
    ) {
      this.entity.move.stop()
      other.move.stop()
    }

    // Adjust position to prevent overlap
    if (!other.isStatic) {
      const dx =
        this.entity.position.x +
        this.entity.width / 2 -
        (other.position.x + other.width / 2)
      const dy =
        this.entity.position.y +
        this.entity.height / 2 -
        (other.position.y + other.height / 2)
      const combinedHalfWidths = (this.entity.width + other.width) / 2
      const combinedHalfHeights = (this.entity.height + other.height) / 2

      if (
        Math.abs(dx) < combinedHalfWidths &&
        Math.abs(dy) < combinedHalfHeights
      ) {
        const overlapX = combinedHalfWidths - Math.abs(dx)
        const overlapY = combinedHalfHeights - Math.abs(dy)

        if (overlapX >= overlapY) {
          if (dy > 0) {
            this.entity.position.y += overlapY
          } else {
            this.entity.position.y -= overlapY
          }
        } else {
          if (dx > 0) {
            this.entity.position.x += overlapX
          } else {
            this.entity.position.x -= overlapX
          }
        }
      }
    }
  }

  /**
   * Checks for collisions with other entities
   */
  update() {
    const collidables = getCollidableData()
    for (const other of collidables) {
      if (!other) continue
      if (other.id === this.entity.id) continue
      if (this.checkCollision(other)) {
        this.handleCollision(other)
      }
    }
  }
}

export default Collidable
