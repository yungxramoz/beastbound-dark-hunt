export class Environment {
  constructor(options) {
    this.game = options.game
    this.game.ctx.imageSmoothingEnabled = false

    this.backgroundImage = options.backgroundImage
    this.middlegroundImage = options.middlegroundImage

    this.groundTiles = options.groundTiles || []
    this.tileSize = options.tileSize || 100

    this.props = options.props || []

    this.backgroundSpeed = options.backgroundSpeed || 0.5
    this.backgroundX = 0
    this.time = 0
  }

  getCalculatedImageSize(image) {
    const height = this.game.canvas.height
    const aspectRatio = image.width / image.height
    const width = height * aspectRatio

    return { width, height }
  }

  updateBackground() {
    let { width } = this.getCalculatedImageSize(this.backgroundImage)
    this.backgroundX -= this.backgroundSpeed
    if (this.backgroundX <= -width * 2) {
      this.backgroundX = 0
    }
  }

  drawBackground() {
    if (this.backgroundImage.complete) {
      const { width, height } = this.getCalculatedImageSize(
        this.backgroundImage,
      )

      let x = this.backgroundX
      for (let i = 0; i < 4; i++) {
        this.game.ctx.drawImage(this.backgroundImage, x, 0, width, height)
        x += width
      }
    }
  }

  drawMiddleground() {
    if (this.middlegroundImage.complete) {
      const { width, height } = this.getCalculatedImageSize(
        this.middlegroundImage,
      )

      let x = 0
      while (x < this.game.canvas.width) {
        this.game.ctx.drawImage(this.middlegroundImage, x, 0, width, height)
        x += width
      }
    }
  }

  drawGround() {
    for (let row = 0; row < this.groundTiles.length; row++) {
      let colSizeUsed = 0
      for (let col = 0; col < this.groundTiles[row].length; col++) {
        const tile = this.groundTiles[row][col]
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
    this.game.ctx.drawImage(tile.image, x, y, tileWidth, tileHeight)
  }

  draw() {
    this.updateBackground()

    this.drawBackground()
    this.drawMiddleground()
    this.drawGround()
    this.drawProps()
  }
}
