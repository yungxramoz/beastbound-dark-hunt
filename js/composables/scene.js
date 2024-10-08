class Scene {
  constructor(game, backgroundColor = 'black') {
    this.game = game
    this.objects = []

    document.body.style.backgroundColor = backgroundColor
  }
  addObject(object) {
    this.objects.push(object)
  }
  draw(deltaTime) {
    for (const object of this.objects) {
      object.draw(deltaTime)
    }
  }
  update(deltaTime) {
    for (const object of this.objects) {
      object.update(deltaTime)
    }
  }
}

export default Scene
