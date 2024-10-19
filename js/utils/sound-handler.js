import { ASSETS } from '../constants/assets.js'
import { SETTINGS } from '../constants/settings.js'
import { makeSound, soundEffect } from '../library/sound.js'

const playBackgroundMusic = (musicFile) => {
  const backgroundMusic = makeSound(musicFile, () => {
    backgroundMusic.loop = true

    backgroundMusic.volume = SETTINGS.VOLUME_BACKGROUND
    backgroundMusic.pan = 0

    backgroundMusic.play()
  })

  return backgroundMusic
}

const playFootstep = (playbackRate) => {
  const sound = makeSound(ASSETS.FOOTSTEP_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.pan = 0
    sound.playbackRate = playbackRate || 1
    sound.loop = true
  })

  return sound
}

export { playBackgroundMusic, playFootstep }
