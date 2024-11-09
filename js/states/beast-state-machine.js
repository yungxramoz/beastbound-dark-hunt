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
  constructor(enemy, player) {
    super()
    this.enemy = enemy
    this.player = player
    this.path = []
    this.currentWaypointIndex = 0

    this.actionQueue = [BEAST_STATE.HOWL]

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
          if (this.actionQueue.length) {
            this.setNextStateByStack()
          } else {
            this.setNextMoveQueue()
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
        this.howlTimer = 1.75
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
        if (
          this.retreatingTimer <= 0 ||
          this.enemy.position.isOutOfBoundsRight() ||
          this.enemy.position.isOutOfBoundsLeft()
        ) {
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
        this.enemy.sprite.setSprite(GHOST_WOLF_SPRITE.LURING)
        this.enemy.move.stop()
        this.lureTimer = 2 + Math.random() * 3
      },
      update: (deltaTime) => {
        this.lureTimer -= deltaTime
        if (this.isInAttackRange()) {
          this.setNextStateByStack()
        } else if (this.lureTimer <= 0) {
          this.clearMoveStack()
          this.setState(BEAST_STATE.IDLE)
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
          this.enemy.move.jump()
          this.enemy.move.speedX = this.preMoveSpeed * 2
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
    this.actionQueue = []
  }

  setNextMoveQueue() {
    const distance = this.enemy.position.distanceTo(this.player)
    const random = Math.random()
    if (
      this.enemy.position.isOutOfBoundsRight() ||
      this.enemy.position.isOutOfBoundsLeft()
    ) {
      this.addJumpAttack()
    } else if (random < 0.5) {
      this.addChaseAttack()
    } else if (distance > 200 && random < 0.3) {
      this.addLureAttack()
    } else {
      this.addHowlAttack()
    }
  }

  addJumpAttack() {
    this.actionQueue.push(BEAST_STATE.CHASE)
    this.actionQueue.push(BEAST_STATE.JUMP_OVER)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.CHASE)
    this.actionQueue.push(BEAST_STATE.ATTACK)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.RETREAT)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  addChaseAttack() {
    this.actionQueue.push(BEAST_STATE.CHASE)
    this.actionQueue.push(BEAST_STATE.ATTACK)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.RETREAT)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  addLureAttack() {
    this.actionQueue.push(BEAST_STATE.LURE)
    this.actionQueue.push(BEAST_STATE.ATTACK)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.RETREAT)
    this.actionQueue.push(BEAST_STATE.TURN)
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  addHowlAttack() {
    this.actionQueue.push(BEAST_STATE.HOWL)
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  setNextStateByStack() {
    if (this.actionQueue.length) {
      this.setState(this.actionQueue.shift())
    } else {
      this.setNextMoveQueue()
    }
  }

  isInAttackRange() {
    const distance = this.enemy.position.distanceTo(this.player)
    const attackRange = this.enemy.attack.hitRangeWidth - 10
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
