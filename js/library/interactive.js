/*
keyboard
---

The `keyboard` function creates `key` objects
that listen for keyboard events. Create a new key object like
this:

    let keyObject = g.keyboard(asciiKeyCodeNumber);

Then assign `press` and `release` methods like this:

  keyObject.press = function() {
    //key object pressed
  };
  keyObject.release = function() {
    //key object released
  };

Keyboard objects also have `isDown` and `isUp` Booleans that you can check.
https://github.com/Apress/adv-game-design-w-html5-javascript/blob/master/library/interactive.js
*/

export function keyboard(keyValue) {
  let key = {}
  key.keyValue = keyValue
  key.isDown = false
  key.isUp = true
  key.press = undefined
  key.release = undefined

  //The `downHandler`
  key.downHandler = function (event) {
    if (event.key === key.keyValue) {
      if (key.isUp && key.press) key.press()
      key.isDown = true
      key.isUp = false
    }
    //Prevent the event's default behavior
    event.preventDefault()
  }

  //The `upHandler`
  key.upHandler = function (event) {
    if (event.key === key.keyValue) {
      if (key.isDown && key.release) key.release()
      key.isDown = false
      key.isUp = true
    }
    event.preventDefault()
  }

  //Attach event listeners
  window.addEventListener('keydown', key.downHandler.bind(keyValue), false)
  window.addEventListener('keyup', key.upHandler.bind(keyValue), false)

  //Return the key object
  return key
}
