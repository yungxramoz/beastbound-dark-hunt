class DialogManager {
  constructor(game) {
    this.game = game
    this.activeDialogs = []
  }

  openDialog(dialog) {
    this.activeDialogs.push(dialog)
  }

  closeDialog(dialog) {
    const index = this.activeDialogs.indexOf(dialog)
    if (index !== -1) {
      this.activeDialogs.splice(index, 1)
    }
  }

  closeAllDialogs() {
    this.activeDialogs = []
  }

  update(deltaTime) {
    for (const dialog of this.activeDialogs) {
      dialog.update(deltaTime)
    }
  }

  draw(ctx) {
    for (const dialog of this.activeDialogs) {
      dialog.draw(ctx)
    }
  }
}

export default DialogManager
