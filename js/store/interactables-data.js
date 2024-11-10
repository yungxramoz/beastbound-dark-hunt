import dataStore from './data-store.js'

export function getInteractablesData() {
  const data = dataStore.get('interactables')
  return data ? data : []
}

export function setInteractablesData(key, data) {
  let interactables = dataStore.get('interactables', data)
  const exists = interactables.find((interactable) => interactable.id === key)
  if (exists) {
    interactables.forEach((interactable) => {
      if (interactable.id === key) {
        interactable = data
      }
    })
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

export function removeInteractableData(key) {
  let interactables = dataStore.get('interactables')
  const exists = interactables.find((interactable) => interactable.id === key)
  if (exists) {
    interactables = interactables.filter(
      (interactable) => interactable.id !== key,
    )
    dataStore.set('interactables', interactables)
  }
}
