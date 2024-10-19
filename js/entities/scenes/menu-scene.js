import Scene from '../../components/scene.js'
import Dialog from '../../display/dialog.js'
import { GAME_STATE } from '../../states/game-state-machine.js'
import dataStore from '../../store/data-store.js'

class MenuScene extends Scene {
  constructor(game) {
    super(game, {
      colorTop: '#000000',
      colorBottom: '#000000',
    })
    this.game = game

    const dialog = new Dialog(this.game, {
      title: 'BEASTBOUND',
      dialogHeight: 270,
      dialogWidth: 300,
      overlay: false,
      buttons: [],
    })

    const buttons = [
      {
        text: 'Start Game',
        onClick: () => {
          this.game.stateMachine.setState(GAME_STATE.PLAYING)
          this.game.dialogManager.closeDialog(dialog)
        },
        width: 220,
        height: 40,
      },
    ]

    let disabled = true
    if (dataStore.hasStoredData()) {
      disabled = false
    }

    buttons.push({
      text: 'Load Game',
      disabled,
      onClick: () => {
        dataStore.loadFromLocalStorage()
        this.game.stateMachine.changeState(GAME_STATE.PLAYING)
        this.game.dialogManager.closeDialog(dialog)
      },
      width: 220,
      height: 40,
    })

    dialog.setupButtons(buttons)

    this.game.dialogManager.openDialog(dialog)
  }
}

export default MenuScene
