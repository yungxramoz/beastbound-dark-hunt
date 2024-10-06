export function createTypingEffect(text, typingSpeed) {
  return {
    text,
    typingSpeed, // Characters per second
    typedText: '',
    textIndex: 0,
    timeSinceLastChar: 0,
    isTypingComplete: false,

    update(deltaTime) {
      this.timeSinceLastChar += deltaTime * 1000 // Convert to milliseconds
      const charsToAdd = Math.floor(
        (this.timeSinceLastChar * this.typingSpeed) / 1000,
      )

      if (charsToAdd > 0) {
        this.typedText += this.text.substr(this.textIndex, charsToAdd)
        this.textIndex += charsToAdd
        this.timeSinceLastChar = 0

        if (this.textIndex >= this.text.length) {
          this.isTypingComplete = true
        }
      }
    },
  }
}
