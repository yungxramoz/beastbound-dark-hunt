import Movable from '../composables/movable.js'
import Positionable from '../composables/positionable.js'
import Spriteable from '../composables/spriteable.js'
import { getGroundY } from '../utils/bounderies.js'

class Character {
  constructor(
    game,
    {
      x,
      y,
      spriteScale,
      width,
      height,
      offsetX,
      offsetY,
      spriteOffsetX = 0,
      spriteOffsetY = 0,
    },
  ) {
    this.game = game

    this.width = width
    this.height = height

    this.position = new Positionable(this, {
      offsetX,
      offsetY,
      x,
      y,
      height: this.height,
    })
    this.move = new Movable(game, this, {})
    this.sprite = new Spriteable(game, this, {
      spriteScale,
      spriteOffsetX,
      spriteOffsetY,
    })

    this.position.setPosition(x, getGroundY(this.height))
  }

  update(deltaTime) {
    this.move.update()
    this.sprite.update(deltaTime)
  }

  draw(ctx) {
    this.sprite.draw(ctx)
  }
}

export default Character
