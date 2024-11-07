class Spriteable {
  /**
   * Gives an entity the ability to be drawn on the screen using sprite sheets
   * @param {Game} game - The game instance
   * @param {Entity} entity - The entity to attach the Spriteable component to
   * @param {Object} options - The options for the Spriteable component
   * @param {number} [options.spriteScale=1] - The scale of the sprite
   * @param {number} [options.spriteOffsetX=0] - The x offset of the sprite
   * @param {number} [options.spriteOffsetY=0] - The y offset of the sprite
   * @param {boolean} [options.hasShadow=true] - Whether the entity has a shadow
   * @param {number} [options.baseShadowWidth=50] - The base width of the shadow
   * @param {number} [options.baseShadowHeight=18] - The base height of the shadow
   *
   * @throws {Error} - Game instance is required
   * @throws {Error} - Entity is required
   * @throws {Error} - Entity must have a Positionable component
   * @throws {Error} - Entity must have a flipX property
   */
  constructor(
    game,
    entity,
    {
      spriteScale = 1,
      spriteOffsetX = 0,
      spriteOffsetY = 0,
      hasShadow = true,
      baseShadowWidth = 50,
      baseShadowHeight = 18,
      spriteFlipped = false,
    },
  ) {
    if (!game) throw new Error('Spriteable requires a game instance')
    if (!entity) throw new Error('Spriteable requires an entity')
    if (!entity.position)
      throw new Error('Entity must have a Positionable component')
    if (!entity.flipX === undefined)
      throw new Error('Entity must have a flipX property')

    this.game = game
    this.entity = entity
    this.currentFrame = 0
    this.elapsedTime = 0
    this.spriteScale = spriteScale
    this.spriteOffsetX = spriteOffsetX
    this.spriteOffsetY = spriteOffsetY
    this.currentSprite = {
      sheet: null,
      src: null,
      frameWidth: 0,
      frameHeight: 0,
      numFrames: 0,
      frameTime: 0,
    }

    this.hasShadow = hasShadow
    this.baseShadowWidth = baseShadowWidth
    this.baseShadowHeight = baseShadowHeight
    this.spriteFlipped = spriteFlipped
  }

  /**
   * Sets the sprite for the entity
   * @param {Object} sprite - The sprite object
   * @param {string} sprite.src - The source of the sprite sheet
   * @param {number} sprite.frameWidth - The width of each frame in the sprite sheet
   * @param {number} sprite.frameHeight - The height of each frame in the sprite sheet
   * @param {number} sprite.numFrames - The number of frames in the sprite sheet
   * @param {number} sprite.frameTime - The time to display each frame
   */
  setSprite(sprite) {
    if (sprite) {
      this.currentSprite = sprite
      this.currentFrame = 0
    }
  }

  /**
   * Draws the shadow for the entity
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} scaledWidth - The scaled width of the entity
   */
  drawShadow(ctx, scaledWidth) {
    let shadowWidth = this.baseShadowWidth
    let shadowHeight = this.baseShadowHeight
    const shadowX =
      this.entity.position.x +
      this.spriteOffsetX +
      (scaledWidth - shadowWidth) / 2
    const shadowY = this.entity.move.groundY + this.entity.height - 10

    let alpha = 0.4

    if (!this.entity.position.isGrounded() && this.entity.move) {
      const position = this.entity.position.y - this.entity.move.groundY
      alpha = 0.4 + position / 450
      shadowWidth += position / 20
      shadowHeight += position / 50
    }

    const shadowColor = `rgba(0, 0, 0, ${alpha})`

    // Draw shadow
    ctx.save()
    ctx.fillStyle = shadowColor
    ctx.beginPath()
    ctx.ellipse(
      shadowX + shadowWidth / 2,
      shadowY + shadowHeight / 2,
      shadowWidth / 2,
      shadowHeight / 2,
      0,
      0,
      Math.PI * 2,
    )
    ctx.fill()
    ctx.restore()
  }

  draw(ctx) {
    if (this.currentSprite) {
      let frameX = this.currentFrame * this.currentSprite.frameWidth
      let frameY = this.currentSprite.row
        ? this.currentSprite.row * this.currentSprite.frameHeight
        : 0
      const scaledWidth = this.currentSprite.frameWidth * this.spriteScale
      const scaledHeight = this.currentSprite.frameHeight * this.spriteScale

      if (
        this.currentSprite.noLoop &&
        this.currentFrame === this.currentSprite.numFrames - 1
      ) {
        frameX =
          (this.currentSprite.numFrames - 1) * this.currentSprite.frameWidth
      }

      if (this.hasShadow) {
        this.drawShadow(ctx, scaledWidth)
      }

      if (
        (this.entity.flipX && !this.spriteFlipped) ||
        (!this.entity.flipX && this.spriteFlipped)
      ) {
        ctx.save()

        ctx.scale(-1, 1)
        ctx.drawImage(
          this.game.assets[this.currentSprite.src],
          frameX,
          frameY,
          this.currentSprite.frameWidth,
          this.currentSprite.frameHeight,
          -this.entity.position.x - scaledWidth - this.spriteOffsetX,
          this.entity.position.y + this.spriteOffsetY,
          scaledWidth,
          scaledHeight,
        )

        ctx.restore()
      } else {
        ctx.drawImage(
          this.game.assets[this.currentSprite.src],
          frameX,
          frameY,
          this.currentSprite.frameWidth,
          this.currentSprite.frameHeight,
          this.entity.position.x + this.spriteOffsetX,
          this.entity.position.y + this.spriteOffsetY,
          scaledWidth,
          scaledHeight,
        )
      }
    }
  }

  update(deltaTime) {
    if (this.currentSprite) {
      this.elapsedTime += deltaTime

      // Protect against very large deltaTime values that might cause the while loop to run too long
      const maxFrameAdvance = 10 // Limit frame advance to 10 frames per update call
      let framesToAdvance = 0

      while (
        this.elapsedTime >= this.currentSprite.frameTime &&
        framesToAdvance < maxFrameAdvance
      ) {
        this.elapsedTime -= this.currentSprite.frameTime
        this.currentFrame =
          (this.currentFrame + 1) % this.currentSprite.numFrames
        framesToAdvance += 1
      }

      // Optional: If framesToAdvance hits maxFrameAdvance, it means deltaTime was very large, and some frames may have been skipped.
      if (framesToAdvance >= maxFrameAdvance) {
        console.warn('Skipped frames due to high deltaTime')
      }
    }
  }
}

export default Spriteable
