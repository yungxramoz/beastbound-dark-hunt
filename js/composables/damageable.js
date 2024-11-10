import { addBloodParticles } from '../components/particles.js'
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
    this.isImmune = false

    setDamageableData(this.entity.id, this.entity)
  }

  dealDamage(amount) {
    if (this.isImmune) return
    addBloodParticles(this.entity, this.bloodColor)
    this.health -= amount
    if (this.health <= 0) {
      this.health = 0
    }
  }
}

export default Damageable
