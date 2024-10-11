class DialogManager {
  /**
   * The DialogManager class manages the dialogs in the game
   * @param {object} game - The game object
   */
  constructor(game) {
    this.game = game
    this.activeDialogs = []
  }

  /**
   * Opens a dialog
   * @param {Dialog} dialog - The dialog to open
   */
  openDialog(dialog) {
    this.activeDialogs.push(dialog)
  }

  /**
   * Closes a dialog
   * @param {Dialog} dialog - The dialog to close
   */
  closeDialog(dialog) {
    const index = this.activeDialogs.indexOf(dialog)
    if (index !== -1) {
      this.activeDialogs.splice(index, 1)
    }
  }

  /**
   * Closes all dialogs
   */
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
