class Interactable {
  constructor(game, entity) {
    if (!game) throw new Error('Game is required')
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (!entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')
    if (!entity.createDialog)
      throw new Error('Entity must have a createDialog method')

    this.game = game
    this.entity = entity

    this.isInteractable = true
    this.interactionRadius = 100
    this.setupInteractable()
  }

  setupInteractable() {
    if (!this.game.interactables) {
      this.game.interactables = []
    }
    this.game.interactables.push(this)
  }

  start(player) {
    if (this.game.interaction.isInteracting) return

    this.game.interaction.isInteracting = true
    this.game.interaction.entity = this
    this.faceTowards(player)

    if (this.createDialog) {
      this.createDialog(player)
    }
  }

  end() {
    this.game.interaction.entity = null
    this.game.interaction.isInteracting = false
  }

  faceTowards(player) {
    if (player.position.x + player.position.offsetX < this.position.x) {
      this.flipX = true
    } else {
      this.flipX = false
    }
  }
}

export default Interactable
