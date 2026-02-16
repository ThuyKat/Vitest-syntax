// decks data
const DECKS = {
  standard: {
    suits: ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
    values: ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'],
  },
  pokemon: {
    suits: ['Grass', 'Fire', 'Water', 'Electric'],
    values: ['Ace','2','3','4','5','6','7','8','9','10', 'Pichu', 'Pikachu', 'Raichu'],
  },
}

// mimic async fetch with a next-tick delay
export function loadDeck(id = 'standard') {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deck = DECKS[id]

      if (!deck) {
        reject(new Error('deck not found with that id'))
        return
      }

      // fresh copies (avoids mutation of originals)
      const suits = [...deck.suits]
      const values = [...deck.values]

      // sanity check to keep expectations clear
      if (suits.length !== 4 || values.length !== 13) {
        reject(new Error('Expected 4 suits and 13 values'))
        return
      }

      resolve({ suits, values })
    }, 0)
  })
}
