import { describe, it, expect, vi } from "vitest"
import { createCards } from '../src/createCards'
import { deal } from "../src/deal"
import { logDealRound } from '../src/helpers/loggers'

vi.mock('../src/helpers/loggers', async () => {
  const originals = await vi.importActual('../src/helpers/loggers')

  return {
    ...originals,
    logDealRound: vi.fn(() => {
      console.log('logDealRound mock fn called')
      return true
    }),
  }
})

describe('deal', () => {
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King']

  it('deals the correct number of hands', () => {
    const cards = createCards({ suits, values })
    const hands = deal(cards, 5, 3) // 5 cards to 3 players

    expect(hands).toHaveLength(3)
  })

  it('deals each hand the correct number of cards', () => {
    const cards = createCards({ suits, values })
    const hands = deal(cards, 7, 4) // 7 cards to 4 players

    expect(hands[0]).toHaveLength(7)
    expect(hands[1]).toHaveLength(7)
    expect(hands[2]).toHaveLength(7)
    expect(hands[3]).toHaveLength(7)
  })

  it('calls the logger a correct number of times', () => {
    const cards = createCards({ suits, values })

    logDealRound.mockClear()

    deal(cards, 5, 3) // 5 cards to 3 players

    expect(logDealRound).toHaveBeenCalledTimes(5)
    expect(logDealRound).toHaveReturnedWith(true)
  })
})
