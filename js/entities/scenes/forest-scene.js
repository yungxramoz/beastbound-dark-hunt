import Scene from '../../components/scene.js'
import { ASSETS } from '../../constants/assets.js'
import { playBackgroundMusic } from '../../utils/sound-handler.js'
import Player from '../characters/player.js'
import GhostWolf from '../enemies/ghost-wolf.js'
import Forest from '../environments/forest.js'

class ForestScene extends Scene {
  constructor(game) {
    super(game, { colorTop: '#262f14', colorBottom: '#282828' })
    this.game = game

    const player = new Player(game, 100, 0)
    this.addObject(new Forest(game))
    this.addObject(player)
    this.addObject(new GhostWolf(game, player, 800, 0))

    this.bgMusic = playBackgroundMusic(ASSETS.FOREST_BACKGROUND_MUSIC)
  }

  destroy() {
    super.destroy()
    this.bgMusic.stop()
  }
}

export default ForestScene
