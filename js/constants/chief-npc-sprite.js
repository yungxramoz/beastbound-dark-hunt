import { ASSETS } from './assets.js'

const frameWidth = 39
const frameHeight = 52

const CHIEF_NPC_SPRITE = {
  IDLE: {
    src: ASSETS.CHIEF_IDLE_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 4,
    frameTime: 0.24,
  },
  MOVING: {
    src: ASSETS.CHIEF_MOVE_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 6,
    frameTime: 0.16,
  },
}

export { CHIEF_NPC_SPRITE }
