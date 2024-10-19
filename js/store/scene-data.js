import dataStore from './data-store.js'

export const setScene = (scene) => {
  dataStore.set('scene', scene)
}

export const getScene = () => {
  return dataStore.get('scene')
}
