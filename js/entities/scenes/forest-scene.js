import Scene from '../../components/scene.js'
import ChiefNpc from '../characters/chief-npc.js'
import Player from '../characters/player.js'
import Forest from '../environments/forest.js'

class ForestScene extends Scene {
  constructor(game) {
    super(game, { colorTop: '#262f14', colorBottom: '#282828' })
    this.game = game

    this.addObject(new Forest(game))
    this.addObject(new Player(game, 100, 0))
  }
}

export default ForestScene
