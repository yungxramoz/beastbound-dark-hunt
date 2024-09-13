import { Environment } from '../../components/environment.js'
import { ASSETS } from '../../constants/assets.js'

export class Settlement extends Environment {
  constructor(game) {
    const tiles = {
      groundTileA: {
        image: game[ASSETS.SETTLEMENT_GROUND_TILE_A],
        width: 25,
        height: 100,
      },
      groundTileB: {
        image: game[ASSETS.SETTLEMENT_GROUND_TILE_B],
        width: 25,
        height: 100,
      },
      houseTileA: {
        image: game[ASSETS.SETTLEMENT_HOUSE_TILE_A],
        width: 350,
        height: 400,
      },
      houseTileB: {
        image: game[ASSETS.SETTLEMENT_HOUSE_TILE_B],
        width: 400,
        height: 500,
      },
      houseTileC: {
        image: game[ASSETS.SETTLEMENT_HOUSE_TILE_C],
        width: 500,
        height: 400,
      },
      wagonTile: {
        image: game[ASSETS.SETTLEMENT_WAGON_TILE],
        width: 200,
        height: 160,
      },
      crateStackTile: {
        image: game[ASSETS.SETTLEMENT_CRATE_STACK_TILE],
        width: 110,
        height: 100,
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
      canvas: game.canvas,
      backgroundImage: game[ASSETS.SETTLEMENT_BACKGROUND],
      middlegroundImage: game[ASSETS.SETTLEMENT_MIDDLEGROUND],
      tileSize: 100,

      // prettier-ignore
      groundTiles: [
        [],
        [],
        [],
        [],
        [],
        getGroundTiles(),
      ],

      props: [
        { x: 280, y: 0, ...tiles.houseTileB },
        { x: -10, y: 100, ...tiles.houseTileA },
        { x: 720, y: 100, ...tiles.houseTileC },
        { x: 580, y: 405, ...tiles.crateStackTile },
        { x: 700, y: 345, ...tiles.wagonTile },
      ],
    }

    super(options)
  }
}
