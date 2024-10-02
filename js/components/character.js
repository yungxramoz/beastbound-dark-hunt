import { Movable } from '../composables/movable.js'
import { Positionable } from '../composables/positionable.js'
import { Spriteable } from '../composables/spriteable.js'
import { getGroundY } from '../utils/bounderies.js'

export class Character {
  constructor(
    x,
    animations,
    spriteScale,
    initialState,
    width,
    height,
    offsetX,
    offsetY,
    spriteOffsetX = 0,
    spriteOffsetY = 0,
  ) {
    Object.assign(
      this,
      Positionable(),
      Spriteable(
        animations,
        spriteScale,
        spriteOffsetX,
        spriteOffsetY,
        initialState,
      ),
      Movable(width, height, offsetX),
    )

    this.width = width
    this.height = height
    this.offsetX = offsetX
    this.offsetY = offsetY

    this.setPosition(x, getGroundY(this.height))
  }

  update(deltaTime) {
    this.updateMovement()
    this.updateSprite(deltaTime)
  }

  draw(ctx) {
    this.drawSprite(ctx)
  }
}
