import { drawImage } from '../display/ui.js'

class Environment {
  /**
   * The Environment class is used to create a game environment with layers, ground tiles, and props.
   * @param {object} game - The game object
   * @param {object} options - The environment options
   * @param {Layer[]} options.layers - The layers of the environment
   * @param {object[]} options.groundTiles - The ground tiles of the environment
   * @param {object[]} options.props - The props of the environment
   */
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

  /**
   * Draw the ground tiles
   */
  drawGround() {
    for (let pos of this.groundTilePositions) {
      const tile = pos.tile
      const x = pos.startX
      const y = this.game.canvas.height - tile.height
      drawImage(this.game.ctx, tile.image, x, y, tile.width, tile.height)
    }
  }

  /**
   * Draw the foreground layers
   */
  drawForeground() {
    for (let layer of this.layers.filter((l) => l.depth > 0)) {
      layer.draw()
    }
  }

  /**
   * Get the ground Y position at a given X position
   * @param {number} xPosition - The X position
   * @returns {number} The ground Y position
   */
  getGroundY(xPosition) {
    for (let pos of this.groundTilePositions) {
      if (xPosition >= pos.startX && xPosition < pos.endX) {
        return this.game.canvas.height - pos.tile.height
      }
    }
    // Default ground level if xPosition is not on any tile
    return this.game.canvas.height
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
}

export default Environment
