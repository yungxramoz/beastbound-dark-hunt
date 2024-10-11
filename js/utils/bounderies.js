import { BOUNDERIES } from '../constants/positions.js'

/**
 * Checks if the given position exceeds the top boundary of the game area.
 *
 * @param {number} y - The y-coordinate of the position.
 * @returns {boolean} - Returns true if the object is out of bounds on the top side
 */
export const getGroundY = (height) => {
  return BOUNDERIES.GROUND_Y - height
}

/**
 * Checks if the given position exceeds the left boundary of the game area.
 *
 * @param {number} x - The x-coordinate of the position.
 * @returns {boolean} - Returns true if the object is out of bounds on the left side
 */
export const isOutOfBoundsLeft = (x) => {
  return x <= 0
}

/**
 * Checks if the given position and width exceed the right boundary of the game area.
 *
 * @param {number} x - The x-coordinate of the position.
 * @param {number} width - The width of the object.
 * @returns {boolean} - Returns true if the object is out of bounds on the right side, otherwise false.
 */
export const isOutOfBoundsRight = (x, width) => {
  return x + width >= BOUNDERIES.GAME_WIDTH
}
