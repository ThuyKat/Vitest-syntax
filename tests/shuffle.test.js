import { describe, it, expect } from 'vitest'
import { createCards } from '../src/createCards'
import { shuffle } from '../src/shuffle'

describe('shuffle', () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King']

  it('randomizes the order of an array of cards', () => {
    const cards = createCards({ suits, values })
    const originalOrder = [...cards]
    const shuffled = shuffle(cards)

    // check for cards in the same position
    const samePositions = shuffled.filter((card, i) => {
      return card === originalOrder[i]
    })

    expect(samePositions.length).toBeLessThan(52)
  })

  it('does not change the length of the array', () => {
    const cards = createCards({ suits, values })
    const shuffled = shuffle(cards)

    expect(shuffled).toHaveLength(52)
  })
})
