const ASSETS = {
  // Font
  FONT: 'assets/fonts/PressStart2P-Regular.ttf',

  // Characters
  PLAYER_IDLE_SPRITE: 'assets/images/characters/player.idle.png',
  PLAYER_MOVE_SPRITE: 'assets/images/characters/player.move.png',
  PLAYER_JUMP_SPRITE: 'assets/images/characters/player.jump.png',
  PLAYER_FALL_SPRITE: 'assets/images/characters/player.fall.png',
  PLAYER_ATTACK_SPRITE: 'assets/images/characters/player.attack.png',

  CHIEF_IDLE_SPRITE: 'assets/images/characters/chief.idle.png',
  CHIEF_MOVE_SPRITE: 'assets/images/characters/chief.move.png',
  CHIEF_AVATAR: 'assets/images/characters/chief.avatar.png',

  // Settlements
  SETTLEMENT_GROUND_TILE_A:
    'assets/images/environments/settlement/ground-1.png',
  SETTLEMENT_GROUND_TILE_B:
    'assets/images/environments/settlement/ground-2.png',
  SETTLEMENT_HOUSE_TILE_A: 'assets/images/environments/settlement/house-1.png',
  SETTLEMENT_HOUSE_TILE_B: 'assets/images/environments/settlement/house-2.png',
  SETTLEMENT_HOUSE_TILE_C: 'assets/images/environments/settlement/house-3.png',
  SETTLEMENT_WAGON_TILE: 'assets/images/environments/settlement/wagon.png',
  SETTLEMENT_CRATE_STACK_TILE:
    'assets/images/environments/settlement/crate-stack.png',
  SETTLEMENT_BACKGROUND: 'assets/images/environments/settlement/background.png',
  SETTLEMENT_MIDDLEGROUND:
    'assets/images/environments/settlement/middleground.png',

  // Forest
  FOREST_GROUND_TILE_A: 'assets/images/environments/forest/ground-1.png',
  FOREST_GROUND_TILE_B: 'assets/images/environments/forest/ground-2.png',
  FOREST_GROUND: 'assets/images/environments/forest/ground.png',
  FOREST_BACKGROUND: 'assets/images/environments/forest/background.png',
  FOREST_MIDDLEGROUND: 'assets/images/environments/forest/middleground.png',
  FOREST_FOREGROUND: 'assets/images/environments/forest/foreground.png',

  // Audio
  SETTLEMENT_BACKGROUND_MUSIC: 'assets/audio/background/tiny-rpg-town.ogg',
  FOOTSTEP_SOUND: 'assets/audio/effects/footsteps.mp3',
  PLAYER_SOUND: 'assets/audio/effects/male-grunts-and-yells.mp3',
  SLASH_SOUND: 'assets/audio/effects/slashes.mp3',
  NPC_SPEECH: 'assets/audio/speeches/npc-male.mp3',
}

const ASSETS_SRC = [
  ASSETS.PLAYER_IDLE_SPRITE,
  ASSETS.PLAYER_MOVE_SPRITE,
  ASSETS.PLAYER_JUMP_SPRITE,
  ASSETS.PLAYER_FALL_SPRITE,
  ASSETS.PLAYER_ATTACK_SPRITE,
  ASSETS.CHIEF_IDLE_SPRITE,
  ASSETS.CHIEF_MOVE_SPRITE,
  ASSETS.CHIEF_AVATAR,
  ASSETS.SETTLEMENT_GROUND_TILE_A,
  ASSETS.SETTLEMENT_GROUND_TILE_B,
  ASSETS.SETTLEMENT_HOUSE_TILE_A,
  ASSETS.SETTLEMENT_HOUSE_TILE_B,
  ASSETS.SETTLEMENT_HOUSE_TILE_C,
  ASSETS.SETTLEMENT_WAGON_TILE,
  ASSETS.SETTLEMENT_CRATE_STACK_TILE,
  ASSETS.SETTLEMENT_BACKGROUND,
  ASSETS.SETTLEMENT_MIDDLEGROUND,
  ASSETS.FOREST_GROUND,
  ASSETS.FOREST_BACKGROUND,
  ASSETS.FOREST_MIDDLEGROUND,
  ASSETS.FOREST_FOREGROUND,
  ASSETS.SETTLEMENT_BACKGROUND_MUSIC,
  ASSETS.FOOTSTEP_SOUND,
  ASSETS.PLAYER_SOUND,
  ASSETS.NPC_SPEECH,
]

export { ASSETS, ASSETS_SRC }
