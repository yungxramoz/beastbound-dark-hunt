class StateMachine {
  /**
   * Creates an instance of StateMachine.
   * Call `setState` in the constructor to trigger the enter function of the inital state.
   */
  constructor() {
    this.currentState = null
    this.states = {}
  }

  /**
   * Adds a new state to the state machine.
   * @param {string} name - The name of the state.
   * @param {Object} lifecycleMethods - The lifecycle methods for the state.
   * @param {Function} [lifecycleMethods.enter] - The function to call when entering the state.
   * @param {Function} [lifecycleMethods.update] - The function to call to update the state.
   * @param {Function} [lifecycleMethods.exit] - The function to call when exiting the state.
   */
  addState(name, { enter = () => {}, update = () => {}, exit = () => {} }) {
    this.states[name] = { enter, update, exit }
  }

  /**
   * Sets the current state of the state machine.
   * @param {string} newState - The new state to transition to.
   * @param {...any} args - Arguments to pass to the enter method of the new state.
   */
  setState(newState, args) {
    if (this.currentState && this.states[this.currentState]) {
      this.states[this.currentState].exit()
    }
    this.currentState = newState
    if (this.states[newState]) {
      this.states[newState].enter(args)
    }
  }

  /**
   * Updates the current state of the state machine.
   * @param {number} deltaTime - The time elapsed since the last update.
   */
  update(deltaTime) {
    if (this.currentState && this.states[this.currentState]) {
      this.states[this.currentState].update(deltaTime)
    }
  }
}

export default StateMachine
