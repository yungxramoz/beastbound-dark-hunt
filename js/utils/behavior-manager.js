class Behavior {
  constructor(name, weight = 1) {
    this.name = name
    this.weight = weight
  }
}

class BehaviorManager {
  constructor(behaviors) {
    this.behaviors = behaviors
    this.currentBehavior = null
    this.minimumDuration = 2000 // Minimum time to stay in a behavior (in ms)
    this.elapsedTime = 0
    this.behaviorCooldown = false
  }

  chooseRandomBehavior() {
    const totalWeight = this.behaviors.reduce(
      (sum, behavior) => sum + behavior.weight,
      0
    )
    let random = Math.random() * totalWeight
    for (let behavior of this.behaviors) {
      if (random < behavior.weight) {
        return behavior
      }
      random -= behavior.weight
    }
    return this.behaviors[0] // Fallback to the first behavior
  }

  stop() {
    this.behaviorCooldown = false
    this.currentBehavior = this.behaviors[0]
  }

  update(deltaTime) {
    if (this.behaviorCooldown) {
      this.elapsedTime += deltaTime

      if (this.elapsedTime >= this.minimumDuration) {
        this.elapsedTime = 0
        this.behaviorCooldown = false
      } else {
        return this.currentBehavior.name // Stay in current behavior until cooldown finishes
      }
    }

    // Choose a new behavior once the cooldown is over
    this.currentBehavior = this.chooseRandomBehavior()
    this.behaviorCooldown = true
    return this.currentBehavior.name
  }
}

export default BehaviorManager
export { Behavior }