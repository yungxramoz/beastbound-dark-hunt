class Spriteable {
  constructor(
    game,
    entity,
    { spriteScale = 1, spriteOffsetX = 0, spriteOffsetY = 0 },
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
  }

  setSprite(sprite) {
    if (this.currentSprite.src === sprite.src) {
      return
    }
    if (sprite) {
      this.currentSprite = sprite
      this.currentFrame = 0
    }
  }

  draw(ctx) {
    if (this.currentSprite) {
      const frameX = this.currentFrame * this.currentSprite.frameWidth
      const frameY = 0
      const scaledWidth = this.currentSprite.frameWidth * this.spriteScale
      const scaledHeight = this.currentSprite.frameHeight * this.spriteScale

      if (this.entity.flipX) {
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
  
      while (this.elapsedTime >= this.currentSprite.frameTime && framesToAdvance < maxFrameAdvance) {
        this.elapsedTime -= this.currentSprite.frameTime
        this.currentFrame = (this.currentFrame + 1) % this.currentSprite.numFrames
        framesToAdvance += 1
      }
  
      // Optional: If framesToAdvance hits maxFrameAdvance, it means deltaTime was very large, and some frames may have been skipped.
      if (framesToAdvance >= maxFrameAdvance) {
        console.warn("Skipped frames due to high deltaTime")
      }
    }
  }
}

export default Spriteable
