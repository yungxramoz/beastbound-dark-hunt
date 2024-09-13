export const Attackable = (attackDuration, attackDamage) => ({
  attackDuration: attackDuration || 1,
  attackDamage: attackDamage || 10,
  isAttacking: false,

  attack() {
    if (!this.isAttacking) {
      this.isAttacking = true
      setTimeout(() => {
        this.isAttacking = false
        console.log('Attack finished')
      }, this.attackDuration * 1000)
      console.log('Attacked')
    }
  },
})
