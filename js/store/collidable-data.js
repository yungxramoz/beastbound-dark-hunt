import dataStore from './data-store.js'

export function getCollidableData() {
  const data = dataStore.get('collidables')
  return data ? data : []
}

export function setCollidableData(key, data) {
  let collidables = dataStore.get('collidables', data)
  const exists = collidables.find((collidable) => collidable.id === key)
  if (exists) {
    collidables.forEach((collidable) => {
      if (collidable.id === key) {
        collidable = data
      }
    })
  } else {
    collidables.push(data)
  }
  dataStore.set('collidables', collidables)
}

export function removeCollidableData(key) {
  let collidables = dataStore.get('collidables')
  const exists = collidables.find((collidable) => collidable.id === key)
  if (exists) {
    collidables = collidables.filter((collidable) => collidable.id !== key)
    dataStore.set('collidables', collidables)
  }
}
