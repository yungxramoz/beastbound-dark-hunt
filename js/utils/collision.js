/**
 * Checks if two rectangles are overlapping.
 * @param {Object} rect1 - First rectangle with properties x, y, width, height.
 * @param {Object} rect2 - Second rectangle with properties x, y, width, height.
 * @returns {boolean} True if rectangles overlap, false otherwise.
 */
export function areRectanglesOverlapping(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

/**
 * Calculates the distance between two points.
 * @param {number} x1 - X coordinate of the first point.
 * @param {number} y1 - Y coordinate of the first point.
 * @param {number} x2 - X coordinate of the second point.
 * @param {number} y2 - Y coordinate of the second point.
 * @returns {number} The distance between the two points.
 */
export function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Checks if a point is within a circle.
 * @param {number} pointX - X coordinate of the point.
 * @param {number} pointY - Y coordinate of the point.
 * @param {number} circleX - X coordinate of the circle's center.
 * @param {number} circleY - Y coordinate of the circle's center.
 * @param {number} radius - Radius of the circle.
 * @returns {boolean} True if the point is within the circle, false otherwise.
 */
export function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
  return getDistance(pointX, pointY, circleX, circleY) <= radius
}

/**
 * Checks if the entity is facing towards an entity.
 * @param {Object} entity - The source object with properties x, offsetX, width, and flipX.
 * @param {Object} target - The target object with properties x, offsetX, width.
 * @returns {boolean} True if the source is facing the target, false otherwise.
 */
export function isFacingTowards(entity, target) {
  const playerCenterX = entity.position.x + entity.width / 2
  const entityCenterX = target.position.x + target.width / 2

  if (entity.flipX) {
    // facing left
    return entityCenterX <= playerCenterX
  } else {
    // facing right
    return entityCenterX >= playerCenterX
  }
}
