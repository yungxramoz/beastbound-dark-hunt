class Layer {
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
        (sum, img) => sum + (this.width || img.width),
        0,
      )
      if (this.x <= -totalWidth) {
        this.x = 0
      }
    }
  }

  draw() {
    let x = this.x
    const canvasWidth = this.game.canvas.width

    while (x < canvasWidth) {
      for (let imgObj of this.images) {
        const image = imgObj.image
        const imgWidth = imgObj.width || image.width
        const imgHeight = imgObj.height || image.height
        this.game.ctx.drawImage(image, x, this.y, imgWidth, imgHeight)
        x += imgWidth
      }
    }
  }
}

export default Layer
