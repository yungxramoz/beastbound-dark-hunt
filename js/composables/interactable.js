export const Interactable = (game) => ({
  isInteractable: true,
  interactionRadius: 100,

  setupInteractable() {
    if (!game.interactables) {
      game.interactables = []
    }
    game.interactables.push(this)
  },

  startInteraction(player) {
    if (game.interaction.isInteracting) return

    game.interaction.isInteracting = true
    game.interaction.entity = this
    this.faceTowards(player)

    if (this.createDialog) {
      this.createDialog(player)
    } else {
      console.warn('Interactable entity does not have a createDialog method')
    }
  },

  endInteraction() {
    game.interaction.entity = null
    game.interaction.isInteracting = false
  },

  faceTowards(player) {
    if (this.flipX == undefined) {
      console.warn('Interactable entity does not have a flipX property')
      return
    }
    if (player.x + player.offsetX < this.x + this.offsetX) {
      this.flipX = true
    } else {
      this.flipX = false
    }
  },
})
