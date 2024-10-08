class StateMachine {
  constructor(initialState) {
    this.currentState = initialState || null
    this.states = {}
  }

  addState(name, { enter = () => {}, update = () => {}, exit = () => {} }) {
    this.states[name] = { enter, update, exit }
  }

  setState(newState) {
    if (this.currentState && this.states[this.currentState]) {
      this.states[this.currentState].exit()
    }
    this.currentState = newState
    if (this.states[newState]) {
      this.states[newState].enter()
    }
  }

  update(deltaTime) {
    if (this.currentState && this.states[this.currentState]) {
      this.states[this.currentState].update(deltaTime)
    }
  }
}

export default StateMachine
