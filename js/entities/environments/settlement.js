import { Environment } from '../../components/environment.js'
import { ASSETS } from '../../constants/assets.js'

export class Settlement extends Environment {
  constructor(game) {
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
      },
      houseTileB: {
        image: game.assets[ASSETS.SETTLEMENT_HOUSE_TILE_B],
        width: 380,
        height: 470,
      },
      houseTileC: {
        image: game.assets[ASSETS.SETTLEMENT_HOUSE_TILE_C],
        width: 480,
        height: 380,
      },
      wagonTile: {
        image: game.assets[ASSETS.SETTLEMENT_WAGON_TILE],
        width: 200,
        height: 160,
      },
      crateStackTile: {
        image: game.assets[ASSETS.SETTLEMENT_CRATE_STACK_TILE],
        width: 100,
        height: 90,
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
      game: game,
      backgroundImage: game.assets[ASSETS.SETTLEMENT_BACKGROUND],
      middlegroundImage: game.assets[ASSETS.SETTLEMENT_MIDDLEGROUND],
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
        { x: 260, y: 30, ...tiles.houseTileB },
        { x: -10, y: 160, ...tiles.houseTileA },
        { x: 740, y: 120, ...tiles.houseTileC },
        { x: 550, y: 415, ...tiles.crateStackTile },
        { x: 700, y: 345, ...tiles.wagonTile },
      ],
    }

    super(options)
  }
}
