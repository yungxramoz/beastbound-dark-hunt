import { Settlement } from '../entities/environments/settlement.js'
import { Player } from '../entities/characters/player.js'

export class SettlementScene {
  constructor(game) {
    this.environment = new Settlement(game)
    this.player = new Player(game, 100, 400)
  }

  update(deltaTime) {
    this.player.update(deltaTime)
  }

  draw(ctx) {
    this.environment.draw(ctx)
    this.player.draw(ctx)
  }
}
