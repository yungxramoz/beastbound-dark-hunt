export const makePointer = (canvas) => {
  let pointer = { x: 0, y: 0, isDown: false, isUp: true }

  const moveHandler = (event) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    pointer.x = (event.clientX - rect.left) * scaleX
    pointer.y = (event.clientY - rect.top) * scaleY
  }

  const downHandler = () => {
    pointer.isDown = true
    pointer.isUp = false
  }

  const upHandler = () => {
    pointer.isDown = false
    pointer.isUp = true
  }

  canvas.addEventListener('mousemove', moveHandler)
  canvas.addEventListener('mousedown', downHandler)
  canvas.addEventListener('mouseup', upHandler)

  return pointer
}
