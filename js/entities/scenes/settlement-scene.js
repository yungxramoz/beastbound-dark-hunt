import Settlement from '../environments/settlement.js'
import Player from '../characters/player.js'
import ChiefNpc from '../characters/chief-npc.js'
import Scene from '../../composables/scene.js'

class SettlementScene extends Scene {
  constructor(game) {
    super(game, '#170f20')
    this.game = game

    this.addObject(new Settlement(game))
    this.addObject(new ChiefNpc(game, 550, 0, 'Village Chief St. Johan'))
    this.addObject(new Player(game, 100, 0))
  }
}

export default SettlementScene
