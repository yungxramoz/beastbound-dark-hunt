import Settlement from '../environments/settlement.js'
import Player from '../characters/player.js'
import ChiefNpc from '../characters/chief-npc.js'
import Scene from '../../components/scene.js'
import { playBackgroundMusic } from '../../utils/sound-handler.js'
import { ASSETS } from '../../constants/assets.js'

class SettlementScene extends Scene {
  constructor(game) {
    super(game, { colorTop: '#854a62', colorBottom: '#170f20' })
    this.game = game

    this.addObject(new Settlement(game))
    this.addObject(new ChiefNpc(game, 550, 0, 'Village Chief St. Johan'))
    this.addObject(new Player(game, 100, 0))

    this.bgMusic = playBackgroundMusic(ASSETS.SETTLEMENT_BACKGROUND_MUSIC)
  }

  destroy() {
    super.destroy()
    this.bgMusic.pause()
  }
}

export default SettlementScene
