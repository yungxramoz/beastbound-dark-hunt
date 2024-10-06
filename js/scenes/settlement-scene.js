import { Settlement } from '../entities/environments/settlement.js'
import { Player } from '../entities/characters/player.js'
import { ChiefNpc } from '../entities/characters/chief-npc.js'

export class SettlementScene {
  constructor(game) {
    this.game = game
    this.environment = new Settlement(game)
    this.player = new Player(game, 100)
    this.chief = new ChiefNpc(game, 550, 'Village Chief St. Johan')
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
