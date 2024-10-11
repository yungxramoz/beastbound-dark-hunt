import { drawImage } from '../display/ui.js'

class Environment {
  constructor(game, { layers = [], groundTiles = [], props = [] } = {}) {
    this.game = game
    this.layers = layers
    this.groundTiles = groundTiles
    this.props = props

    // Build ground tile positions
    this.groundTilePositions = []
    let x = 0
    for (let tile of this.groundTiles) {
      this.groundTilePositions.push({
        tile: tile,
        startX: x,
        endX: x + tile.width,
      })
      x += tile.width
    }
  }

  update() {
    for (let layer of this.layers) {
      layer.update()
    }
    for (let prop of this.props) {
      if (prop.update) {
        prop.update()
      }
    }
  }

  draw() {
    // Draw layers with depth <= 0 (background layers)
    for (let layer of this.layers.filter((l) => l.depth <= 0)) {
      layer.draw()
    }

    // Draw props in the background
    for (let prop of this.props.filter((p) => p.depth <= 0)) {
      drawImage(
        this.game.ctx,
        prop.image,
        prop.x,
        prop.y,
        prop.width,
        prop.height,
      )
    }

    // Draw ground tiles
    this.drawGround()

    // Draw props in the foreground
    for (let prop of this.props.filter((p) => p.depth > 0)) {
      drawImage(
        this.game.ctx,
        prop.image,
        prop.x,
        prop.y,
        prop.width,
        prop.height,
      )
    }
  }

  drawGround() {
    for (let pos of this.groundTilePositions) {
      const tile = pos.tile
      const x = pos.startX
      const y = this.game.canvas.height - tile.height
      drawImage(this.game.ctx, tile.image, x, y, tile.width, tile.height)
    }
  }

  drawForeground() {
    for (let layer of this.layers.filter((l) => l.depth > 0)) {
      layer.draw()
    }
  }

  getGroundY(xPosition) {
    for (let pos of this.groundTilePositions) {
      if (xPosition >= pos.startX && xPosition < pos.endX) {
        return this.game.canvas.height - pos.tile.height
      }
    }
    // Default ground level if xPosition is not on any tile
    return this.game.canvas.height
  }
}

export default Environment
