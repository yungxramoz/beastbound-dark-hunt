import dataStore from './data-store.js'

export function getInteractablesData() {
  const data = dataStore.get('interactables')
  return data ? data : []
}

export function setInteractablesData(key, data) {
  const interactables = dataStore.get('interactables', data)
  if (interactables[key]) {
    interactables[key] = data
  } else {
    interactables.push(data)
  }
  dataStore.set('interactables', interactables)
}

export function setCurrentInteractable(data) {
  dataStore.set('currentInteractable', data)
}

export function getCurrentInteractable() {
  return dataStore.get('currentInteractable')
}
