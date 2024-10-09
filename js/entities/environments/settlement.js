import Environment from '../../components/environment.js'
import Layer from '../../components/layer.js'
import { ASSETS } from '../../constants/assets.js'

class Settlement extends Environment {
  constructor(game) {
    const backgroundLayer = new Layer(game, {
      images: [
        {
          image: game.assets[ASSETS.SETTLEMENT_BACKGROUND],
          width: 800,
          height: 600,
        },
      ],
      speed: 0.2,
      parallaxFactor: 1,
      repeat: true,
      depth: -2, // Background layer
    })

    const middlegroundLayer = new Layer(game, {
      images: [
        {
          image: game.assets[ASSETS.SETTLEMENT_MIDDLEGROUND],
          width: 1000,
          height: 600,
        },
      ],
      speed: 0,
      parallaxFactor: 0,
      repeat: true,
      depth: -1, // Middleground layer
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
      houseTileA: {
        image: game.assets[ASSETS.SETTLEMENT_HOUSE_TILE_A],
        width: 310,
        height: 340,
        depth: -1, // Background prop
      },
      houseTileB: {
        image: game.assets[ASSETS.SETTLEMENT_HOUSE_TILE_B],
        width: 380,
        height: 470,
        depth: -1,
      },
      houseTileC: {
        image: game.assets[ASSETS.SETTLEMENT_HOUSE_TILE_C],
        width: 480,
        height: 380,
        depth: -1,
      },
      wagonProp: {
        image: game.assets[ASSETS.SETTLEMENT_WAGON_TILE],
        width: 200,
        height: 160,
        depth: 1, // Foreground prop
      },
      crateStackProp: {
        image: game.assets[ASSETS.SETTLEMENT_CRATE_STACK_TILE],
        width: 100,
        height: 90,
        depth: 1,
      },
    }

    const getGroundTiles = () => {
      const groundTiles = []
      for (let i = 0; i < 48; i++) {
        groundTiles.push(i % 2 === 0 ? tiles.groundTileA : tiles.groundTileB)
      }
      return groundTiles
    }

    const options = {
      layers: [backgroundLayer, middlegroundLayer],
      groundTiles: getGroundTiles(),
      props: [
        { x: 260, y: 30, ...tiles.houseTileB },
        { x: -10, y: 160, ...tiles.houseTileA },
        { x: 740, y: 120, ...tiles.houseTileC },
        { x: 550, y: 415, ...tiles.crateStackProp },
        { x: 700, y: 345, ...tiles.wagonProp },
      ],
    }

    super(game, options)
  }
}

export default Settlement
