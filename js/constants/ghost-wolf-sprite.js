import { ASSETS } from './assets.js'

const frameWidth = 88
const frameHeight = 60

const GHOST_WOLF_SPRITE = {
  IDLE: {
    src: ASSETS.GHOST_WOLF_SPRITE_2,
    frameWidth,
    frameHeight,
    numFrames: 4,
    frameTime: 0.18,
    row: 0,
  },
  MOVING: {
    src: ASSETS.GHOST_WOLF_SPRITE_1,
    frameWidth,
    frameHeight,
    numFrames: 10,
    frameTime: 0.12,
    row: 7,
  },
  TURNING: {
    src: ASSETS.GHOST_WOLF_SPRITE_2,
    frameWidth,
    frameHeight,
    numFrames: 4,
    frameTime: 0.16,
    row: 2,
  },
  HOWL: {
    src: ASSETS.GHOST_WOLF_SPRITE_1,
    frameWidth,
    frameHeight,
    numFrames: 5,
    frameTime: 0.25,
    row: 9,
    noLoop: true,
  },
  RUNNING: {
    src: ASSETS.GHOST_WOLF_SPRITE_2,
    frameWidth,
    frameHeight,
    numFrames: 5,
    frameTime: 0.12,
    row: 1,
  },
  ATTACKING: {
    src: ASSETS.GHOST_WOLF_SPRITE_1,
    frameWidth,
    frameHeight,
    numFrames: 9,
    frameTime: 0.1,
    row: 4,
  },
  JUMPING: {
    src: ASSETS.GHOST_WOLF_SPRITE_1,
    frameWidth,
    frameHeight,
    numFrames: 6,
    frameTime: 0.2,
    row: 0,
    noLoop: true,
  },
}

export { GHOST_WOLF_SPRITE }
