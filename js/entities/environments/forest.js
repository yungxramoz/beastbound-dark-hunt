import Environment from '../../components/environment.js'
import Layer from '../../components/layer.js'
import { ASSETS } from '../../constants/assets.js'

class Forest extends Environment {
  constructor(game) {
    const backgroundLayer = new Layer(game, {
      images: [
        {
          image: game.assets[ASSETS.FOREST_BACKGROUND],
          width: 896,
          height: 608,
        },
      ],
      speed: 0,
      parallaxFactor: 0,
      repeat: true,
      depth: -2,
    })

    const middlegroundLayer = new Layer(game, {
      images: [
        {
          image: game.assets[ASSETS.FOREST_MIDDLEGROUND],
          width: 896,
          height: 608,
        },
      ],
      speed: 0,
      parallaxFactor: 0,
      repeat: true,
      depth: -1, // Middleground layer
    })

    const foregroundLayer = new Layer(game, {
      images: [
        {
          image: game.assets[ASSETS.FOREST_FOREGROUND],
          width: 896,
          height: 608,
        },
      ],
      speed: 0,
      parallaxFactor: 0,
      repeat: true,
      depth: 1, // Foreground layer
    })

    const tiles = {
      groundTileA: {
        image: game.assets[ASSETS.SETTLEMENT_GROUND_TILE_A],
        width: 25,
        height: 100,
      },
      groundTileB: {
        image: game.assets[ASSETS.SETTLEMENT_GROUND_TILE_B],
        width: 25,
        height: 100,
      },
    }

    const ground = {
      image: game.assets[ASSETS.FOREST_GROUND],
      width: game.canvas.width,
      height: 500,
    }

    const options = {
      layers: [backgroundLayer, middlegroundLayer, foregroundLayer],
      groundTiles: [ground],
      props: [],
    }

    super(game, options)
  }
}

export default Forest
