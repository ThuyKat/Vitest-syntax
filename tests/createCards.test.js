import { describe, it, expect } from 'vitest'
import { createCards } from '../src/createCards'

describe('createCards', () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King']

  // force a return shape first
  it('returns an array', () => {
    const cards = createCards({ suits, values })

    expect(Array.isArray(cards)).toBe(true)
  })

  // check the length of the returned array
  it('creates a deck of 52 cards', () => {
    const cards = createCards({ suits, values })

    expect(cards).toHaveLength(52)
  })

  // check each card has the right shape
  it('creates card objects with { value, suit } properties', () => {
    const cards = createCards({ suits, values })
    const sample = cards[0]

    expect(sample).toBeTypeOf('object')
    expect(sample).toHaveProperty('suit')
    expect(sample).toHaveProperty('value')
  })

  // check function works correctly and creates combinations
  it('creates combinations of suits and values', () => {
    const cards = createCards({ suits, values })

    const tenOfHearts = cards.find(c => c.value === '10' && c.suit === 'Hearts')
    expect(tenOfHearts).toBeDefined()

    const aceOfSpades = cards.find(c => c.value === 'Ace' && c.suit === 'Spades')
    expect(aceOfSpades).toBeDefined()
  })

  // check for invalid argument types
  it('throws an error if suits or values are not arrays', () => {
    expect(() => createCards({ suits: 'not an array', values })).toThrow()
    expect(() => createCards({ suits, values: 'not an array' })).toThrow()
  })

  // check the argument lengths
  it('throws an error if suits or values are not standard lengths', () => {
    expect(() => createCards({ suits: ['Hearts'], values })).toThrow(/4/)
    expect(() => createCards({ suits, values: ['1', '2'] })).toThrow(/13/)
  })

  // check for duplicates
  it('throws an error for duplicate suits or values', () => {
    expect(() => createCards({
      suits: ['Hearts', 'Diamonds', 'Clubs', 'Clubs'],
      values
    })).toThrow(/duplicates/)

    expect(() => createCards({
      suits,
      values: ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'Ace']
    })).toThrow(/duplicates/)
  })
})
