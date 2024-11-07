import { GHOST_WOLF_SPRITE } from '../constants/ghost-wolf-sprite.js'
import StateMachine from './state-machine.js'

const BEAST_STATE = {
  IDLE: 'IDLE',
  CHASE: 'CHASE',
  ATTACK: 'ATTACK',
  QUICK_ATTACK: 'QUICK_ATTACK',
  RETREAT: 'RETREAT',
  TURN: 'TURN',
  LURE: 'LURE',
  HOWL: 'HOWL',
  JUMP_OVER: 'JUMP_OVER',
}

class BeastStateMachine extends StateMachine {
  constructor(enemy, player, navigationGraph) {
    super()
    this.enemy = enemy
    this.player = player
    this.navigationGraph = navigationGraph
    this.path = []
    this.currentWaypointIndex = 0

    this.actionStack = [BEAST_STATE.HOWL]

    this.setupStates()
    this.setState(BEAST_STATE.IDLE)
  }

  setupStates() {
    // IDLE State
    this.addState(BEAST_STATE.IDLE, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.IDLE)
        this.enemy.move.stop()
        // Idle for 0.5-2 seconds
        this.idleTimer = 0.5 + Math.random() * 1.5
      },
      update: (deltaTime) => {
        this.idleTimer -= deltaTime
        if (this.idleTimer <= 0) {
          if (this.actionStack.length) {
            this.setNextStateByStack()
          } else {
            this.setNextMoveStack()
          }
        }
      },
    })

    // HOWL State
    this.addState(BEAST_STATE.HOWL, {
      enter: () => {
        this.nextMove = null
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.HOWL)
        this.enemy.move.stop()
        this.howlTimer = 1.25
      },
      update: (deltaTime) => {
        this.howlTimer -= deltaTime
        if (this.howlTimer <= 0) {
          this.setNextStateByStack()
        }
      },
      exit: () => {},
    })

    // CHASE State
    this.addState(BEAST_STATE.CHASE, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.MOVING)
      },
      update: () => {
        if (this.isInAttackRange()) {
          this.setNextStateByStack()
        } else {
          this.chasePlayer()
        }
      },
      exit: () => {},
    })

    // ATTACK State
    this.addState(BEAST_STATE.ATTACK, {
      enter: () => {
        this.enemy.move.stop()
        this.enemy.attack.hit()
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.ATTACKING)
      },
      update: () => {
        if (!this.enemy.attack.isAttacking) {
          this.setNextStateByStack()
        }
      },
    })

    // TURN State
    this.addState(BEAST_STATE.TURN, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.TURNING)
        this.enemy.move.stop()
        this.turning = true
        this.turnTimer = 0.5
      },
      update: (deltaTime) => {
        this.turnTimer -= deltaTime
        if (this.turnTimer <= 0) {
          this.setNextStateByStack()
        }
      },
      exit: () => {
        this.enemy.flipX = !this.enemy.flipX
      },
    })

    // RETREAT State
    this.addState(BEAST_STATE.RETREAT, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.RUNNING)
        this.retreatingTimer = 1
        this.enemy.move.maxSpeed = this.enemy.move.maxSpeed * 2.5
        const moveAwayDirection = this.enemy.flipX ? 'left' : 'right'
        this.enemy.move[moveAwayDirection]()
      },
      update: (deltaTime) => {
        this.retreatingTimer -= deltaTime
        if (this.retreatingTimer <= 0) {
          this.setNextStateByStack()
        }
      },
      exit: () => {
        this.enemy.move.maxSpeed = this.enemy.move.maxSpeed / 2.5
      },
    })

    // LURE State
    this.addState(BEAST_STATE.LURE, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.IDLE)
        this.enemy.move.stop()
        this.lureTimer = 2 + Math.random() * 1
      },
      update: (deltaTime) => {
        this.lureTimer -= deltaTime
        if (this.isInAttackRange()) {
          this.setNextStateByStack()
        } else if (this.lureTimer <= 0) {
          this.clearMoveStack()
        }
      },
      exit: () => {},
    })

    // JUMP_OVER State
    this.addState(BEAST_STATE.JUMP_OVER, {
      enter: () => {
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.JUMPING)
        this.preMoveSpeed = this.enemy.move.speedX
        this.jumpDelay = 0.2
        this.jumpOverTimer = 1
        this.hasJumped = false

        this.enemy.move.stop()
      },
      update: (deltaTime) => {
        this.jumpOverTimer -= deltaTime
        this.jumpDelay -= deltaTime
        if (this.jumpDelay <= 0 && !this.hasJumped) {
          this.enemy.move.speedX = this.preMoveSpeed * 2
          this.enemy.move.jump()
          this.hasJumped = true
        }
        if (this.jumpOverTimer <= 0) {
          this.setNextStateByStack()
        }
      },
      exit: () => {
        this.enemy.move.speedX = this.enemy.move.speedX / 2
      },
    })
  }

  clearMoveStack() {
    this.actionStack = []
  }

  setNextMoveStack() {
    const distance = this.enemy.position.distanceTo(this.player)
    const random = Math.random()
    console.log('Distance:', distance, 'Random:', random)
    if (distance < 500 && random < 0.7) {
      this.actionStack.push(BEAST_STATE.CHASE)
      this.actionStack.push(BEAST_STATE.ATTACK)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.RETREAT)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.IDLE)
    } else if (distance > 200 && random < 0.2) {
      this.actionStack.push(BEAST_STATE.LURE)
      this.actionStack.push(BEAST_STATE.ATTACK)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.RETREAT)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.IDLE)
    } else if (random < 0.1) {
      this.actionStack.push(BEAST_STATE.HOWL)
      this.actionStack.push(BEAST_STATE.IDLE)
    } else {
      this.actionStack.push(BEAST_STATE.CHASE)
      this.actionStack.push(BEAST_STATE.JUMP_OVER)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.ATTACK)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.RETREAT)
      this.actionStack.push(BEAST_STATE.TURN)
      this.actionStack.push(BEAST_STATE.IDLE)
    }
  }

  setNextStateByStack() {
    if (this.actionStack.length) {
      this.setState(this.actionStack.shift())
    } else {
      this.setNextMoveStack()
    }
  }

  isInAttackRange() {
    const distance = this.enemy.position.distanceTo(this.player)
    const attackRange = this.enemy.attack.hitRangeWidth
    return distance <= attackRange
  }

  chasePlayer() {
    const direction =
      this.player.position.x < this.enemy.position.x ? 'left' : 'right'
    this.enemy.move.faceTowards(this.player.position)
    this.enemy.move[direction]()
  }
}

export default BeastStateMachine
export { BEAST_STATE as BEAST_STATE }
