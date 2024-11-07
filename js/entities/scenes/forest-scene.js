import Scene from '../../components/scene.js'
import ChiefNpc from '../characters/chief-npc.js'
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
  }
}

export default ForestScene
