export class Behavior {
  constructor(name, execute, weight = 1) {
    this.name = name
    this.execute = execute
    this.weight = weight
  }
}

export class BehaviorManager {
  constructor(character, behaviors) {
    this.character = character
    this.behaviors = behaviors
    this.currentTimeout = null
  }

  start() {
    this.performNextAction()
  }

  performNextAction() {
    const behavior = this.chooseRandomBehavior()
    behavior.execute(() => {
      this.performNextAction()
    })
  }

  chooseRandomBehavior() {
    const totalWeight = this.behaviors.reduce(
      (sum, behavior) => sum + behavior.weight,
      0,
    )
    let random = Math.random() * totalWeight
    for (let behavior of this.behaviors) {
      if (random < behavior.weight) {
        return behavior
      }
      random -= behavior.weight
    }
    return this.behaviors[0]
  }

  stop() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }
  }
}
