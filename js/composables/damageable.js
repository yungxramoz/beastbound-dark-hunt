class Damageable {
  constructor({ health = 100 } = {}) {
    this.health = health
  }

  damage(amount) {
    this.health -= amount
  }
}

export default Damageable
