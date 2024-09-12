class StateMachine {
  constructor(initialState) {
    this.currentState = initialState || null
    this.states = {}
  }

  // Method to add a state with enter, update, and exit callbacks
  addState(name, { enter = () => {}, update = () => {}, exit = () => {} }) {
    this.states[name] = { enter, update, exit }
  }

  // Set the current state
  setState(newState) {
    if (this.currentState && this.states[this.currentState]) {
      // Call the exit method for the current state
      this.states[this.currentState].exit()
    }
    this.currentState = newState
    if (this.states[newState]) {
      // Call the enter method for the new state
      this.states[newState].enter()
    }
  }

  // Update the current state (called each frame)
  update(deltaTime) {
    if (this.currentState && this.states[this.currentState]) {
      this.states[this.currentState].update(deltaTime)
    }
  }
}

export default StateMachine
