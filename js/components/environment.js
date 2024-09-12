export class Environment {
  constructor(options) {
    this.canvas = options.canvas
    this.ctx = this.canvas.getContext('2d')

    this.ctx.imageSmoothingEnabled = false

    this.backgroundImage = options.backgroundImage
    this.middlegroundImage = options.middlegroundImage

    this.foregroundTiles = options.foregroundTiles || []
    this.tileSize = options.tileSize || 100

    this.props = options.props || []

    this.backgroundSpeed = options.backgroundSpeed || 0.5
    this.backgroundX = 0
    this.time = 0
  }

  updateBackground() {
    this.backgroundX -= this.backgroundSpeed
    if (this.backgroundX <= -this.backgroundImage.width * 2.08) {
      this.backgroundX = 0
    }
  }

  drawBackground() {
    if (this.backgroundImage.complete) {
      const backgroundHeight = this.canvas.height
      const aspectRatio =
        this.backgroundImage.width / this.backgroundImage.height
      const backgroundWidth = backgroundHeight * aspectRatio

      let x = this.backgroundX
      for (let i = 0; i < 3; i++) {
        this.ctx.drawImage(
          this.backgroundImage,
          x,
          0,
          backgroundWidth,
          backgroundHeight,
        )
        x += backgroundWidth
      }
    }
  }

  drawMiddleground() {
    if (this.middlegroundImage.complete) {
      const middlegroundHeight = this.canvas.height
      const aspectRatio =
        this.middlegroundImage.width / this.middlegroundImage.height
      const middlegroundWidth = middlegroundHeight * aspectRatio

      let x = 0

      while (x < this.canvas.width) {
        this.ctx.drawImage(
          this.middlegroundImage,
          x,
          0,
          middlegroundWidth,
          middlegroundHeight,
        )
        x += middlegroundWidth
      }
    }
  }

  drawForeground() {
    for (let row = 0; row < this.foregroundTiles.length; row++) {
      let colSizeUsed = 0
      for (let col = 0; col < this.foregroundTiles[row].length; col++) {
        const tile = this.foregroundTiles[row][col]
        if (tile) {
          this.drawTile(tile, colSizeUsed, row * this.tileSize)
        }
        colSizeUsed += tile?.width || this.tileSize
      }
    }
  }

  drawProps() {
    this.props.forEach((prop) => {
      this.drawTile(prop, prop.x, prop.y)
    })
  }

  drawTile(tile, x, y) {
    const tileWidth = tile.width || this.tileSize
    const tileHeight = tile.height || this.tileSize
    this.ctx.drawImage(tile.image, x, y, tileWidth, tileHeight)
  }

  draw() {
    this.updateBackground()

    this.drawBackground()
    this.drawMiddleground()
    this.drawForeground()
    this.drawProps()
  }
}
