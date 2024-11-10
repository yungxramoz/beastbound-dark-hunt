import Destructable from '../composables/desctructable.js'
import Movable from '../composables/movable.js'
import Positionable from '../composables/positionable.js'
import Spriteable from '../composables/spriteable.js'
import { getGroundY } from '../utils/boundaries.js'
import { getId } from '../utils/id.js'

class Character {
  /**
   * A character can move, jump, and has a sprite that can be drawn
   * @param {Game} game - The game instance
   * @param {Object} options - The options for the Character component
   * @param {number} options.x - The x position of the character
   * @param {number} options.y - The y position of the character
   * @param {number} options.spriteScale - The scale of the sprite
   * @param {number} options.width - The width of the character
   * @param {number} options.height - The height of the character
   * @param {number} [options.offsetX=0] - The x offset of the character
   * @param {number} [options.offsetY=0] - The y offset of the character
   * @param {number} [options.moveSpeed=5] - The speed at which the character moves
   * @param {number} [options.jumpSpeed=15] - The speed at which the character jumps
   * @param {number} [options.gravity=0.98] - The gravity that affects the character
   * @param {number} [options.spriteOffsetX=0] - The x offset of the sprite
   * @param {number} [options.spriteOffsetY=0] - The y offset of the sprite
   * @param {number} [options.baseShadowWidth=50] - The base width of the shadow
   * @param {number} [options.baseShadowHeight=18] - The base height of the shadow
   */
  constructor(
    game,
    {
      x,
      y,
      spriteScale,
      width,
      height,
      offsetX = 0,
      offsetY = 0,
      moveSpeed = 5,
      jumpSpeed = 15,
      gravity = 0.98,
      spriteOffsetX = 0,
      spriteOffsetY = 0,
      baseShadowWidth = 50,
      baseShadowHeight = 18,
    },
  ) {
    this.id = getId()
    this.game = game

    this.width = width
    this.height = height

    this.flipX = false

    this.position = new Positionable(this, {
      offsetX,
      offsetY,
      x,
      y,
      height: this.height,
    })
    this.move = new Movable(game, this, { moveSpeed, jumpSpeed, gravity })
    this.sprite = new Spriteable(game, this, {
      spriteScale,
      spriteOffsetX,
      spriteOffsetY,
      hasShadow: true,
      baseShadowWidth,
      baseShadowHeight,
    })
    this.destruct = new Destructable(this)

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
