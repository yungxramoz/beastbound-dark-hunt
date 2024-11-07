class Interactable {
  /**
   * Gives the entity the ability to be interacted with
   * @param {Entity} entity - The entity to attach the Interactable component to
   *
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a Positionable composable
   * @throws {Error} - Entity must have a flipX property
   * @throws {Error} - Entity must have a createDialog method
   *
   */
  constructor(entity) {
    if (!entity) throw new Error('Entity is required')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')
    if (!entity.createDialog)
      throw new Error('Entity must have a createDialog method')

    this.entity = entity

    this.isInteractable = true
    this.radius = 100
    this.isInteracting = false
    this.interactingEntity = null
  }

  /**
   * Starts the interaction with the source entity
   * @param {Entity} source - The entity that is starting the interaction
   */
  start(source) {
    if (this.entity.move) {
      this.entity.move.faceTowards(source.position)
    }
    this.isInteracting = true
    this.interactingEntity = source
  }

  /**
   * Ends the current interaction
   */
  end() {
    this.isInteracting = false

    if (this.interactingEntity && this.interactingEntity.onInteractionEnd) {
      this.interactingEntity.onInteractionEnd()
    }
    this.interactingEntity = null
  }
}

export default Interactable
