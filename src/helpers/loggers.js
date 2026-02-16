export function logDealRound(hands, roundNumber) {
  console.log('[DEAL] Round', roundNumber, ':')

  for (let i = 0; i < hands.length; i++) {
    console.log(`Player ${i + 1}: ${hands[i].length} cards: `, hands[i])
  }
}
