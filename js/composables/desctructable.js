import { removeCollidableData } from '../store/collidable-data.js'
import { removeInteractableData } from '../store/interactables-data.js'

class Destructable {
  constructor(entity) {
    if (!entity) throw new Error('Entity is required')

    this.entity = entity
  }

  destroy() {
    //check if entity has a prop of the class Interactable
    if (this.entity.interaction) {
      removeInteractableData(this.entity.id)
    }

    if (this.entity.collide) {
      removeCollidableData(this.entity.id)
    }
  }
}

export default Destructable
