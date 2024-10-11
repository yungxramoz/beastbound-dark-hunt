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
    const foregroundObjects = this.objects.filter(
      (object) => object.drawForeground,
    )
    for (const foregroundObject of foregroundObjects) {
      foregroundObject.drawForeground(deltaTime)
    }

    //check if dialog is open
    if (this.game.dialogManager.activeDialogs.length > 0) {
      document.querySelectorAll('.overlay').forEach((overlay) => {
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)'
      })
    } else {
      document.querySelectorAll('.overlay').forEach((overlay) => {
        overlay.style.backgroundColor = ''
      })
    }
  }
  update(deltaTime) {
    for (const object of this.objects) {
      object.update(deltaTime)
    }
  }
}

export default Scene
