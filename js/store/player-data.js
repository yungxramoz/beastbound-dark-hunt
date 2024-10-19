import dataStore from './data-store.js'

export function getPlayerData() {
  return dataStore.get('player')
}

export function setPlayerData(data) {
  dataStore.set('player', data)
}
