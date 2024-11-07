class Damageable {
  constructor({ health = 100 } = {}) {
    this.health = health
  }

  dealDamage(amount) {
    this.health -= amount
  }
}

export default Damageable
