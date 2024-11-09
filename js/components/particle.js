// utilities.js

import { getGroundY } from '../utils/boundaries.js'

// Array to store active particles
export let particles = []

/**
 * Particle Class
 * Represents a single blood particle.
 */
class Particle {
  /**
   * Creates a new Particle.
   * @param {number} x - The x position of the particle.
   * @param {number} y - The y position of the particle.
   * @param {string} color - The color of the particle.
   */
  constructor(x, y, color) {
    this.x = x
    this.y = y
    // Random velocity for splatter effect
    this.vx = (Math.random() - 0.5) * 6 // Increased speed for better splatter
    this.vy = (Math.random() - 0.5) * 6
    this.color = color || 'rgba(255, 0, 0, 0.8)' // Default color is red
    this.size = Math.floor(Math.random() * 3) + 1 // Random size between 1 and 3 pixels
    this.lifespan = 60 // Frames the particle will live
    this.gravity = 0.2 // Gravity effect
    this.groundY = getGroundY(this.size) // Ground level for particles
  }

  /**
   * Updates the particle's position and decreases its lifespan.
   */
  update() {
    if (this.y < this.groundY) {
      this.vy += this.gravity // Apply gravity to vertical velocity
      this.x += this.vx
      this.y += this.vy
    }

    this.lifespan -= 1

    // Optional: Add air resistance
    this.vx *= 0.98
    this.vy *= 0.98
  }

  /**
   * Draws the particle on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx) {
    ctx.save()
    ctx.fillStyle = this.color
    // Draw a pixelated square
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.size, this.size)
    ctx.restore()
  }
}

/**
 * Adds blood particles to a target object.
 * @param {Object} target - The object to emit particles from. Must have `x` and `y` properties.
 * @param {string} [color] - The color of the blood particles.
 * @param {number} [count=20] - The number of particles to generate.
 */
export function addBloodParticles(target, color = null, count = 40) {
  const centerX = target.position.x + target.width / 2
  const centerY = target.position.y + target.height / 2

  for (let i = 0; i < count; i++) {
    const particle = new Particle(centerX, centerY, color)
    particles.push(particle)
  }
}

/**
 * Updates all active particles.
 */
export function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.update()
    if (p.lifespan <= 0) {
      particles.splice(i, 1)
    }
  }
}

/**
 * Draws all active particles.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
export function drawParticles(ctx) {
  particles.forEach((p) => p.draw(ctx))
}
