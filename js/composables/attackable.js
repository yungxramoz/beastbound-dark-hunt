export const Attackable = () => ({
  attackDuration: 0.5,
  attackDamage: 10,
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
