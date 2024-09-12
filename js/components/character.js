import { Positionable } from '../composables/positionable.js'
import { Spriteable } from '../composables/spriteable.js'

export class Character {
  constructor() {
    Object.assign(this, Positionable(), Spriteable())
  }
}
