import { BOUNDERIES } from '../constants/positions.js'

export const getGroundY = (height) => {
  return BOUNDERIES.GROUND_Y - height
}

export const isOutOfBoundsLeft = (x) => {
  return x <= 0
}

export const isOutOfBoundsRight = (x, width) => {
  return x + width >= BOUNDERIES.GAME_WIDTH
}
