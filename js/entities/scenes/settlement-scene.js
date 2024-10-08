import Settlement from '../environments/settlement.js'
import Player from '../characters/player.js'
import ChiefNpc from '../characters/chief-npc.js'

class SettlementScene {
  constructor(game) {
    this.game = game
    this.environment = new Settlement(game)
    this.player = new Player(game, 100, 0)
    this.chief = new ChiefNpc(game, 550, 0, 'Village Chief St. Johan')
  }

  update(deltaTime) {
    this.chief.update(deltaTime)
    this.player.update(deltaTime)
  }

  draw(ctx) {
    this.environment.draw(ctx)
    this.chief.draw(ctx)
    this.player.draw(ctx)
  }
}

export default SettlementScene
