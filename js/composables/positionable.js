export const Positionable = () => ({
  x: 0,
  y: 0,

  move(xOffset, yOffset) {
    this.x += xOffset
    this.y += yOffset
  },

  setPosition(x, y) {
    this.x = x
    this.y = y
  },
})
