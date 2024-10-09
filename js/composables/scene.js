class Scene {
  constructor(game, { colorTop = 'black', colorBottom = 'black' } = {}) {
    this.game = game
    this.objects = []

    document.getElementById('top-bar').style.backgroundColor = colorTop
    document.getElementById('bottom-bar').style.backgroundColor = colorBottom
  }
  addObject(object) {
    this.objects.push(object)
  }
  draw(deltaTime) {
    for (const object of this.objects) {
      object.draw(deltaTime)
    }
    const foregroundObject = this.objects.find(
      (object) => object.drawForeground,
    )
    if (foregroundObject) {
      foregroundObject.drawForeground(deltaTime)
    }
  }
  update(deltaTime) {
    for (const object of this.objects) {
      object.update(deltaTime)
    }
  }
}

export default Scene
