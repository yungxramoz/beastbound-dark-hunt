import { GHOST_WOLF_SPRITE } from '../constants/ghost-wolf-sprite.js'
import { isFacingTowards } from '../utils/collision.js'
import StateMachine from './state-machine.js'

const BEAST_STATE = {
  IDLE: 'IDLE',
  CHASE: 'CHASE',
  ATTACK: 'ATTACK',
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
        if (!isFacingTowards(this.enemy, this.player)) {
          this.setState(BEAST_STATE.TURN)
          return
        }
        this.enemy.move.stop()
        // Idle for 0.5-2 seconds
        this.idleTimer = 0.5 + Math.random() * 1.5
      },
      update: (deltaTime) => {
        this.idleTimer -= deltaTime
        if (this.idleTimer <= 0) {
          if (this.actionQueue.length) {
            this.setNextStateByQueue()
          } else {
            this.setNextActions()
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
        this.enemy.addBuff('howl', { str: 5, duration: 5 + this.howlTimer })
      },
      update: (deltaTime) => {
        this.howlTimer -= deltaTime
        if (this.howlTimer <= 0) {
          this.setNextStateByQueue()
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
          this.setNextStateByQueue()
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
          this.setNextStateByQueue()
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
          this.setNextStateByQueue()
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
          this.setNextStateByQueue()
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
        this.enemy.damage.isImmune = true
        this.lureTimer = 2 + Math.random() * 3
        this.enemy.addBuff('lure', { str: 10, duration: this.lureTimer })
      },
      update: (deltaTime) => {
        this.lureTimer -= deltaTime
        if (this.isInAttackRange()) {
          this.setNextStateByQueue()
        } else if (this.lureTimer <= 0) {
          this.clearActionQueue()
          this.setState(BEAST_STATE.IDLE)
        }
      },
      exit: () => {
        this.enemy.damage.isImmune = false
      },
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
          this.setNextStateByQueue()
        }
      },
      exit: () => {
        this.enemy.move.speedX = this.enemy.move.speedX / 2
      },
    })
  }

  clearActionQueue() {
    this.actionQueue = []
  }

  setNextActions() {
    const distance = this.enemy.position.distanceTo(this.player)
    const enemyHasBuff = !!this.enemy.buff['howl']
    const random = Math.random()
    if (
      this.enemy.position.isOutOfBoundsRight() ||
      (this.enemy.position.isOutOfBoundsLeft() && distance < 100) ||
      random < 0.2
    ) {
      this.addJumpAttack()
    } else if (random < 0.4) {
      this.addLureAttack()
    } else if (random < 0.5 && !enemyHasBuff) {
      this.addHowlAttack()
    } else {
      this.addChaseAttack()
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
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  addHowlAttack() {
    this.actionQueue.push(BEAST_STATE.HOWL)
    this.actionQueue.push(BEAST_STATE.IDLE)
  }

  setNextStateByQueue() {
    if (this.actionQueue.length) {
      this.setState(this.actionQueue.shift())
    } else {
      this.setNextActions()
    }
  }

  isInAttackRange() {
    const distance = this.enemy.position.distanceTo(this.player)
    const attackRange = this.enemy.attack.hitRangeWidth - 15
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
export { BEAST_STATE }
