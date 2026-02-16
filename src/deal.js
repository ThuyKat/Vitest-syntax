import { logDealRound } from './helpers/loggers'

export function deal(cards, handSize, numberOfPlayers) {
  const hands = Array.from({ length: numberOfPlayers }, () => [])

  for (let i = 0; i < handSize; i++) {
    for (let playerIndex = 0; playerIndex < numberOfPlayers; playerIndex++) {
      if (cards.length === 0) {
        throw new Error('Not enough cards to deal')
      }
      hands[playerIndex].push(cards.shift())
    }

    logDealRound(hands, i + 1)
  }

  return hands
}
