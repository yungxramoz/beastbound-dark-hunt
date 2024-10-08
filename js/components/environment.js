import { drawImage } from '../utils/ui.js'

class Environment {
  constructor(
    game,
    {
      backgroundImage,
      middlegroundImage,
      groundTiles,
      props,
      tileSize,
      backgroundSpeed,
    } = {},
  ) {
    this.game = game
    this.game.ctx.imageSmoothingEnabled = false

    this.backgroundImage = backgroundImage
    this.middlegroundImage = middlegroundImage

    this.groundTiles = groundTiles || []
    this.tileSize = tileSize || 100

    this.props = props || []

    this.backgroundSpeed = backgroundSpeed || 0.5
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
        drawImage(this.game.ctx, this.backgroundImage, x, 0, width, height)
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
        drawImage(this.game.ctx, this.middlegroundImage, x, 0, width, height)
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
    drawImage(this.game.ctx, tile.image, x, y, tileWidth, tileHeight)
  }

  draw() {
    this.drawBackground()
    this.drawMiddleground()
    this.drawGround()
    this.drawProps()
  }

  update() {
    this.updateBackground()
  }
}

export default Environment
