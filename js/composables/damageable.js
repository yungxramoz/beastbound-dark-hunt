import { addBloodParticles } from '../components/particle.js'
import { setDamageableData } from '../store/damageables-data.js'

class Damageable {
  constructor(
    entity,
    { health = 100, bloodColor = 'rgba(255, 0, 0, 0.5)' } = {},
  ) {
    if (!entity) throw new Error('Entity is required')

    this.entity = entity
    this.health = health
    this.bloodColor = bloodColor

    setDamageableData(this.entity.id, this)
  }

  dealDamage(amount) {
    addBloodParticles(this.entity, this.bloodColor)
    this.health -= amount
    console.log(`${this.entity.id} health: ${this.health}`)
  }
}

export default Damageable
