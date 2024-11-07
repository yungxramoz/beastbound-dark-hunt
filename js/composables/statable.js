import { HEALTH_BASE, STAT_MODIFIER } from '../constants/stat-modifier.js'

class Statable {
  constructor(game, entity, { str, agi, def, con } = {}) {
    this.entity = entity
    this.game = game
    this.stats = {
      str: str || 1,
      agi: agi || 1,
      def: def || 1,
      con: con || 1,
    }
  }

  maxHealth() {
    return HEALTH_BASE + this.stats.con * STAT_MODIFIER.CON
  }

  strength() {
    return Math.max(Math.floor(this.stats.str * STAT_MODIFIER.STR), 1)
  }

  evadeChance() {
    return Math.min(this.stats.agi * STAT_MODIFIER.AGI, MAX_EVADE_CHANCE)
  }

  defense() {
    return this.stats.def * STAT_MODIFIER.DEF
  }

  addStr(value) {
    this.stats.str += value
  }

  addAgi(value) {
    this.stats.agi += value
  }

  addDef(value) {
    this.stats.def += value
  }

  addCon(value) {
    this.stats.con += value
  }
}

export default Statable
