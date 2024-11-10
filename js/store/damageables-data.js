import dataStore from './data-store.js'

export function getDamageableData() {
  const data = dataStore.get('damageables')
  return data ? data : []
}

export function setDamageableData(key, data) {
  let damageables = dataStore.get('damageables', data)
  const exists = damageables.find((damageable) => damageable.id === key)
  if (exists) {
    damageables.forEach((damageable) => {
      if (damageable.id === key) {
        damageable = data
      }
    })
  } else {
    damageables.push(data)
  }
  dataStore.set('damageables', damageables)
}

export function removeDamageableData(key) {
  let damageables = dataStore.get('damageables')
  const exists = damageables.find((damageable) => damageable.id === key)
  if (exists) {
    damageables = damageables.filter((damageable) => damageable.id !== key)
    dataStore.set('damageables', damageables)
  }
}
