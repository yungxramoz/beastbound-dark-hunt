import dataStore from './data-store.js'

export function getDamageableData() {
  const data = dataStore.get('damageables')
  return data ? data : []
}

export function setDamageableData(key, data) {
  const damageables = dataStore.get('damageables', data)
  if (damageables[key]) {
    damageables[key] = data
  } else {
    damageables.push(data)
  }
  dataStore.set('damageables', damageables)
}

export function removeDamageableData(key) {
  const damageables = dataStore.get('damageables')
  if (damageables[key]) {
    delete damageables[key]
    dataStore.set('damageables', damageables)
  }
}
