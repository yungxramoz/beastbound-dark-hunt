export const Spriteable = (animations, spriteScale, initialState) => ({
  currentState: initialState || 'idle',
  currentFrame: 0,
  elapsedTime: 0,
  flipX: false,
  spriteScale: spriteScale || 1,
  animations: animations || {},

  drawSprite(context) {
    const animation = this.animations[this.currentState]

    if (animation) {
      const frameX = this.currentFrame * animation.frameWidth
      const frameY = 0
      const scaledWidth = animation.frameWidth * this.spriteScale
      const scaledHeight = animation.frameHeight * this.spriteScale

      if (this.flipX) {
        context.save()

        context.scale(-1, 1)
        context.drawImage(
          animation.spriteSheet,
          frameX,
          frameY,
          animation.frameWidth,
          animation.frameHeight,
          -this.x - scaledWidth,
          this.y,
          scaledWidth,
          scaledHeight,
        )

        context.restore()
      } else {
        context.drawImage(
          animation.spriteSheet,
          frameX,
          frameY,
          animation.frameWidth,
          animation.frameHeight,
          this.x,
          this.y,
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
