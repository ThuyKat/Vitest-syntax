export function createCards({ suits, values }) {
  if (!Array.isArray(suits) || !Array.isArray(values)) {
    throw new TypeError('suits and values must be arrays')
  }
  if (suits.length !== 4 || values.length !== 13) {
    throw new RangeError('suits and values must be standard lengths (4 and 13)')
  }
  if (new Set(suits).size !== suits.length) {
    throw new Error('suits array contains duplicates')
  }
  if (new Set(values).size !== values.length) {
    throw new Error('values array contains duplicates')
  }

  let cards = []

  for (const suit of suits) {
    for (const value of values) {
      cards.push({ value, suit })
    }
  }

  return cards
}
