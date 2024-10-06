export const Spriteable = (
  animations,
  spriteScale,
  spriteOffsetX,
  spriteOffsetY,
  initialState,
) => ({
  currentState: initialState || 'idle',
  currentFrame: 0,
  elapsedTime: 0,
  flipX: false,
  spriteScale: spriteScale || 1,
  spriteOffsetX: spriteOffsetX || 0,
  spriteOffsetY: spriteOffsetY || 0,
  animations: animations || {},

  drawSprite(ctx) {
    const animation = this.animations[this.currentState]

    if (animation) {
      const frameX = this.currentFrame * animation.frameWidth
      const frameY = 0
      const scaledWidth = animation.frameWidth * this.spriteScale
      const scaledHeight = animation.frameHeight * this.spriteScale

      if (this.flipX) {
        ctx.save()

        ctx.scale(-1, 1)
        ctx.drawImage(
          animation.spriteSheet,
          frameX,
          frameY,
          animation.frameWidth,
          animation.frameHeight,
          -this.x - scaledWidth - this.spriteOffsetX,
          this.y + this.spriteOffsetY,
          scaledWidth,
          scaledHeight,
        )

        ctx.restore()
      } else {
        ctx.drawImage(
          animation.spriteSheet,
          frameX,
          frameY,
          animation.frameWidth,
          animation.frameHeight,
          this.x + this.spriteOffsetX,
          this.y + this.spriteOffsetY,
          scaledWidth,
          scaledHeight,
        )
      }
    }
  },

  updateSprite(deltaTime) {
    const animation = this.animations[this.currentState]

    if (animation) {
      this.elapsedTime += deltaTime

      while (this.elapsedTime >= animation.frameTime) {
        this.elapsedTime -= animation.frameTime
        this.currentFrame = (this.currentFrame + 1) % animation.numFrames
      }
    }
  },

  updateSpriteState(newState) {
    if (this.currentState === newState) {
      return
    }
    if (this.animations[newState]) {
      this.currentState = newState
      this.currentFrame = 0
    }
  },
})
