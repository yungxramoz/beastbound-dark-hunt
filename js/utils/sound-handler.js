import { ASSETS } from '../constants/assets.js'
import { SETTINGS } from '../constants/settings.js'
import { makeSound } from '../library/sound.js'

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

const playNpcMaleSpeech = () => {
  const sound = makeSound(ASSETS.NPC_SPEECH, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = false
  })

  return sound
}

const playMaleYells = () => {
  const sound = makeSound(ASSETS.PLAYER_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = false
  })

  return sound
}

const playSlash = () => {
  const sound = makeSound(ASSETS.SLASH_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT - 1 // asset is too loud
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = false
  })

  return sound
}

const playWolfHowl = () => {
  const sound = makeSound(ASSETS.WOLF_HOWL_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.echo = true
    sound.playbackRate = 1
    sound.loop = false
  })

  return sound
}

const playGrowl = () => {
  const sound = makeSound(ASSETS.GROWL_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = true
    sound.echo = true
  })

  return sound
}

const playDeepGrowl = () => {
  const sound = makeSound(ASSETS.DEEP_GROWL_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT + 1 // asset is too quiet
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = true
  })

  return sound
}

const playBite = () => {
  const sound = makeSound(ASSETS.WOLF_BITE_SOUND, () => {
    sound.volume = SETTINGS.VOLUME_EFFECT
    sound.pan = 0
    sound.playbackRate = 1
    sound.loop = false
  })

  return sound
}

export {
  playBackgroundMusic,
  playFootstep,
  playNpcMaleSpeech,
  playMaleYells,
  playSlash,
  playWolfHowl,
  playGrowl,
  playDeepGrowl,
  playBite,
}
