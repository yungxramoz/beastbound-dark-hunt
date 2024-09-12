import { Environment } from '../../components/environment.js'

const assetPath = '../../../assets/images/environments/settlement/'

const getAsset = (asset) => `${assetPath}${asset}`

const groundTileA = {
  image: new Image(),
  src: getAsset('ground-1.png'),
  width: 25,
  height: 100,
}
const groundTileB = {
  image: new Image(),
  src: getAsset('ground-2.png'),
  width: 25,
  height: 100,
}

const houseTileA = {
  image: new Image(),
  src: getAsset('house-1.png'),
  width: 350,
  height: 400,
}
const houseTileB = {
  image: new Image(),
  src: getAsset('house-2.png'),
  width: 400,
  height: 500,
}
const houseTileC = {
  image: new Image(),
  src: getAsset('house-3.png'),
  width: 500,
  height: 400,
}

const wagonTile = {
  image: new Image(),
  src: getAsset('wagon.png'),
  width: 200,
  height: 160,
}

const crateStackTile = {
  image: new Image(),
  src: getAsset('crate-stack.png'),
  width: 110,
  height: 100,
}

const groundTiles = () => {
  const tiles = []
  for (let i = 0; i < 48; i++) {
    tiles.push(i % 2 === 0 ? groundTileA : groundTileB)
  }
  return tiles
}

export class Settlement extends Environment {
  constructor(game) {
    const options = {
      canvas: game.canvas,
      backgroundImage: getAsset('background.png'),
      middlegroundImage: getAsset('middleground.png'),
      tileSize: 100,

      // prettier-ignore
      foregroundTiles: [
        [],
        [],
        [],
        [],
        [],
        groundTiles(),
      ],

      props: [
        { x: 280, y: 0, ...houseTileB },
        { x: -10, y: 100, ...houseTileA },
        { x: 720, y: 100, ...houseTileC },
        { x: 580, y: 405, ...crateStackTile },
        { x: 700, y: 345, ...wagonTile },
      ],
    }

    options.foregroundTiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile && tile.src) {
          tile.image.src = tile.src
        }
      })
    })

    options.props.forEach((prop) => {
      prop.image.src = prop.src
    })

    super(options)
  }
}
