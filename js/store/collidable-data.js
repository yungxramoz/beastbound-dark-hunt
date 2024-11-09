import dataStore from './data-store.js'

export function getCollidableData() {
  const data = dataStore.get('collidables')
  return data ? data : []
}

export function setCollidableData(key, data) {
  const collidables = dataStore.get('collidables', data)
  if (collidables[key]) {
    collidables[key] = data
  } else {
    collidables.push(data)
  }
  dataStore.set('collidables', collidables)
}

export function removeCollidableData(key) {
  const collidables = dataStore.get('collidables')
  if (collidables[key]) {
    delete collidables[key]
    dataStore.set('collidables', collidables)
  }
}
