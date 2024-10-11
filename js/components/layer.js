class Layer {
  /**
   * A layer can have images that are drawn and updated for parallax scrolling
   * @param {Game} game - The game instance
   * @param {Object} options - The options for the Layer component
   * @param {Array} [options.images=[]] - The images to draw
   * @param {number} [options.speed=0] - The speed at which the layer moves
   * @param {number} [options.x=0] - The x position of the layer
   * @param {number} [options.y=0] - The y position of the layer
   * @param {number} [options.parallaxFactor=1] - The factor at which the layer moves
   * @param {boolean} [options.repeat=true] - Whether the layer repeats
   * @param {number} [options.depth=0] - The depth of the layer
   */
  constructor(
    game,
    {
      images = [],
      speed = 0,
      x = 0,
      y = 0,
      parallaxFactor = 1,
      repeat = true,
      depth = 0,
    } = {},
  ) {
    this.game = game
    this.images = images
    this.speed = speed
    this.x = x
    this.y = y
    this.parallaxFactor = parallaxFactor
    this.repeat = repeat
    this.depth = depth
  }

  update() {
    this.x -= this.speed * this.parallaxFactor
    if (this.repeat) {
      const totalWidth = this.images.reduce(
        (sum, imgObj) => sum + (imgObj.width || imgObj.image.width),
        0,
      )
      if (this.x <= -totalWidth) {
        this.x = 0
      }
    }
  }

  draw() {
    let x = Math.round(this.x)
    const canvasWidth = this.game.canvas.width
    while (x < canvasWidth) {
      for (let imgObj of this.images) {
        const image = imgObj.image
        const imgWidth = imgObj.width || image.width
        const imgHeight = imgObj.height || image.height
        this.game.ctx.drawImage(
          image,
          Math.round(x),
          this.y,
          imgWidth,
          imgHeight,
        )
        x += imgWidth
      }
    }
  }
}

export default Layer
