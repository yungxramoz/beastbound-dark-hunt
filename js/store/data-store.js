class DataStore {
  constructor(
    initialData = {
      player: null,
      interactables: [],
      collidables: [],
      damageables: [],
      scene: null,
    },
  ) {
    this.data = initialData
    this.listeners = []

    // Load data from local storage if available
    const savedData = localStorage.getItem('gameData')
    if (savedData) {
      this.data = JSON.parse(savedData)
    }
  }

  /**
   * Get data by key
   * @param {string} key - The key of the data
   * @returns {any} - The value of the data
   */
  get(key) {
    return this.data[key]
  }

  /**
   * Set data by key and notify listeners
   * @param {string} key - The key of the data
   * @param {any} value - The value of the data
   */
  set(key, value) {
    this.data[key] = value
    this.notify()
    // this.saveToLocalStorage()
  }

  /**
   * Get all data
   * @returns {Object} - The data object
   */
  getAll() {
    return this.data
  }

  /**
   * Set all data and notify listeners
   * @param {Object} newData - The new data object
   */
  setAll(newData) {
    this.data = newData
    this.notify()
    // this.saveToLocalStorage()
  }

  /**
   * Subscribe to data changes
   * @param {function} listener - The listener function to be called when data changes
   * @returns {function} - Returns an unsubscribe function
   */
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  /**
   * Notify all listeners of data changes
   */
  notify() {
    this.listeners.forEach((listener) => listener(this.data))
  }

  /**
   * Save data to local storage
   */
  saveToLocalStorage() {
    localStorage.setItem('gameData', JSON.stringify(this.data))
  }

  /**
   * Load data from local storage
   */
  loadFromLocalStorage() {
    const savedData = localStorage.getItem('gameData')
    if (savedData) {
      this.data = JSON.parse(savedData)
      this.notify()
    }
  }

  hasStoredData() {
    return !!localStorage.getItem('gameData')
  }
}

export default new DataStore()
