import { ASSETS } from './assets.js'

const frameWidth = 124
const frameHeight = 71

const PLAYER_SPRITE = {
  IDLE: {
    src: ASSETS.PLAYER_IDLE_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 6,
    frameTime: 0.12,
  },
  MOVING: {
    src: ASSETS.PLAYER_MOVE_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 6,
    frameTime: 0.12,
  },
  JUMPING: {
    src: ASSETS.PLAYER_JUMP_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 2,
    frameTime: 0.12,
  },
  FALLING: {
    src: ASSETS.PLAYER_FALL_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 2,
    frameTime: 0.12,
  },
  ATTACKING: {
    src: ASSETS.PLAYER_ATTACK_SPRITE,
    frameWidth,
    frameHeight,
    numFrames: 6,
    frameTime: 0.1,
  },
}

export default PLAYER_SPRITE
