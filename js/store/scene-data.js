import dataStore from './data-store.js'

export const setScene = (scene) => {
  const currentScene = dataStore.get('scene')
  if (currentScene) {
    currentScene.destroy()
  }
  dataStore.set('scene', scene)
}

export const getScene = () => {
  return dataStore.get('scene')
}
