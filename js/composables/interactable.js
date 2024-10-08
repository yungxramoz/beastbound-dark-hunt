class Interactable {
  constructor(game, entity) {
    if (!game) throw new Error('Game is required')
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')
    if (!entity.createDialog)
      throw new Error('Entity must have a createDialog method')

    this.game = game
    this.entity = entity

    this.isInteractable = true
    this.radius = 100
    this.isInteracting = false
    this.interactingEntity = null

    if (!this.game.interactables) {
      this.game.interactables = []
    }

    this.game.interactables.push(entity)
  }

  start(source) {
    if (this.entity.move) {
      this.entity.move.faceTowards(source)
    }
    this.isInteracting = true

    this.interactingEntity = source
  }

  end() {
    this.isInteracting = false

    if (this.interactingEntity && this.interactingEntity.onInteractionEnd) {
      this.interactingEntity.onInteractionEnd()
    }
    this.interactingEntity = null
  }
}

export default Interactable
