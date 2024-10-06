import { Character } from '../../components/character.js'
import { Attackable } from '../../composables/attackable.js'
import { ASSETS } from '../../constants/assets.js'
import PLAYER_STATE from '../../constants/player-state.js'
import { SETTINGS } from '../../constants/settings.js'
import { keyboard } from '../../library/interactive.js'
import { getDistance, isFacingTowards } from '../../utils/collision.js'
import StateMachine from '../../utils/state-machine.js'

export class Player extends Character {
  constructor(game, x) {
    const frameWidth = 124
    const frameHeight = 71
    const spriteScale = 1.7

    const attackDuration = 0.6
    const attackDamage = 10
    const hitRangeWidth = 70
    const hitRangeHeight = 50

    const width = 85
    const height = 95
    const offsetX = 55
    const offsetY = 30

    const animations = {
      [PLAYER_STATE.IDLE]: {
        spriteSheet: game.assets[ASSETS.PLAYER_IDLE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.12,
      },
      [PLAYER_STATE.MOVING]: {
        spriteSheet: game.assets[ASSETS.PLAYER_MOVE_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.12,
      },
      [PLAYER_STATE.JUMPING]: {
        spriteSheet: game.assets[ASSETS.PLAYER_JUMP_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 2,
        frameTime: 0.12,
      },
      [PLAYER_STATE.FALLING]: {
        spriteSheet: game.assets[ASSETS.PLAYER_FALL_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 2,
        frameTime: 0.12,
      },
      [PLAYER_STATE.ATTACKING]: {
        spriteSheet: game.assets[ASSETS.PLAYER_ATTACK_SPRITE],
        frameWidth,
        frameHeight,
        numFrames: 6,
        frameTime: 0.1,
      },
    }

    super(
      x,
      animations,
      spriteScale,
      PLAYER_STATE.IDLE,
      width,
      height,
      offsetX,
      offsetY,
    )

    Object.assign(
      this,
      Attackable(
        attackDuration,
        attackDamage,
        this.width,
        this.height,
        this.offsetX,
        this.offsetY,
        hitRangeWidth,
        hitRangeHeight,
      ),
    )

    this.game = game

    this.leftArrow = keyboard('ArrowLeft')
    this.a = keyboard('a')
    this.rightArrow = keyboard('ArrowRight')
    this.d = keyboard('d')
    this.enter = keyboard('Enter')
    this.space = keyboard(' ')

    this.setupStates()
    this.setupKeyboard()
  }

  setupStates() {
    this.stateMachine = new StateMachine(PLAYER_STATE.IDLE)
    this.stateMachine.addState(PLAYER_STATE.IDLE, {
      enter: () => console.log('Entering IDLE state'),
      update: () => {
        if (!this.isGrounded) {
          this.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (this.isMoving) {
          this.stateMachine.setState(PLAYER_STATE.MOVING)
        } else if (this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.ATTACKING)
        }
      },
      exit: () => console.log('Exiting IDLE state'),
    })

    this.stateMachine.addState(PLAYER_STATE.MOVING, {
      enter: () => console.log('Entering MOVING state'),
      update: () => {
        if (!this.isGrounded) {
          this.stateMachine.setState(PLAYER_STATE.JUMPING)
        } else if (!this.isMoving || this.game.interaction.isInteracting) {
          this.stateMachine.setState(PLAYER_STATE.IDLE)
        } else if (this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.ATTACKING)
        }
      },
      exit: () => console.log('Exiting MOVING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.JUMPING, {
      enter: () => console.log('Entering JUMPING state'),
      update: () => {
        if (this.isFalling) {
          this.stateMachine.setState(PLAYER_STATE.FALLING)
        }
      },
      exit: () => console.log('Exiting JUMPING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.FALLING, {
      enter: () => console.log('Entering FALLING state'),
      update: () => {
        if (this.isGrounded) {
          if (this.isMoving) {
            this.stateMachine.setState(PLAYER_STATE.MOVING)
          } else {
            this.stateMachine.setState(PLAYER_STATE.IDLE)
          }
        }
      },
      exit: () => console.log('Exiting FALLING state'),
    })

    this.stateMachine.addState(PLAYER_STATE.ATTACKING, {
      enter: () => console.log('Entering ATTACKING state'),
      update: () => {
        if (!this.isAttacking) {
          this.stateMachine.setState(PLAYER_STATE.IDLE)
        }
      },
      exit: () => {
        console.log('Exiting ATTACKING state')

        if (this.leftArrow.isDown || this.a.isDown) {
          this.flipX = true
          this.moveLeft()
        } else if (this.rightArrow.isDown || this.d.isDown) {
          this.flipX = false
          this.moveRight()
        }
      },
    })
  }

  setupKeyboard() {
    this.leftArrow.press = this.a.press = () => {
      if (this.game.interaction.isInteracting) return
      if (this.isAttacking) return
      this.flipX = true
      this.moveLeft()
    }
    this.leftArrow.release = this.a.release = () => {
      if (!this.rightArrow.isDown && !this.d.isDown) {
        this.stopMoving()
      }
    }

    this.rightArrow.press = this.d.press = () => {
      if (this.game.interaction.isInteracting) return
      if (this.isAttacking) return
      this.flipX = false
      this.moveRight()
    }
    this.rightArrow.release = this.d.release = () => {
      if (!this.leftArrow.isDown && !this.a.isDown) {
        this.stopMoving()
      }
    }

    this.enter.press = () => {
      if (this.game.interaction.isInteracting) return
      if (!this.isGrounded) return
      if (this.checkForInteraction()) return
      this.stopMoving()
      this.attack()
    }

    this.space.press = () => {
      if (this.game.interaction.isInteracting) return
      if (!this.isGrounded) return
      if (this.isAttacking) return
      this.jump()
    }
  }

  checkForInteraction() {
    const interactables = this.game.interactables || []
    let closestEntity = null
    let closestDistance = Infinity

    for (const entity of interactables) {
      if (entity.isInteractable) {
        const distance = this.getDistanceTo(entity)

        const withinRadius = distance <= (entity.interactionRadius || 100)

        const facingTowards = isFacingTowards(this, entity)

        if (withinRadius && facingTowards && distance < closestDistance) {
          closestDistance = distance
          closestEntity = entity
        }
      }
    }

    if (closestEntity) {
      closestEntity.startInteraction(this)
      return true
    }

    return false
  }

  getDistanceTo(entity) {
    const playerCenterX = this.x + this.offsetX + this.width / 2
    const playerCenterY = this.y + this.offsetY + this.height / 2

    const entityCenterX = entity.x + entity.offsetX + entity.width / 2
    const entityCenterY = entity.y + entity.offsetY + entity.height / 2

    return getDistance(
      playerCenterX,
      playerCenterY,
      entityCenterX,
      entityCenterY,
    )
  }

  update(deltaTime) {
    this.stateMachine.update(deltaTime)
    this.updateSpriteState(this.stateMachine.currentState)
    super.update(deltaTime)
  }

  draw(ctx) {
    super.draw(ctx)
    if (SETTINGS.DEBUG) {
      this.drawDebugInfo(ctx)
      this.drawDebugHitBox(ctx)
    }
  }

  drawDebugInfo(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, 200, 140)

    ctx.font = '15px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(`Player SpeedX: ${this.speedX.toFixed(2)}`, 10, 20)
    ctx.fillText(`Player SpeedY: ${this.speedY.toFixed(2)}`, 10, 40)
    ctx.fillText(`Player isGrounded: ${this.isGrounded}`, 10, 60)
    ctx.fillText(`Player isMoving: ${this.isMoving}`, 10, 80)
    ctx.fillText(`Player isAttacking: ${this.isAttacking}`, 10, 100)
    ctx.fillText(`Player state: ${this.stateMachine.currentState}`, 10, 120)

    ctx.strokeStyle = 'red'
    ctx.strokeRect(
      this.x + this.offsetX,
      this.y + this.offsetY,
      this.width,
      this.height,
    )
    ctx.font = '12px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(
      `Player X: ${this.x.toFixed(2)} Y: ${this.y.toFixed(2)}`,
      this.x + 20,
      this.y + 20,
    )
  }
}
