export function longestString(str1, str2) {
  if (str2.trim().length > str1.trim().length) return str2

  return str1
}

export function isPrime(num) {
  if (typeof num !== 'number') throw new Error('Input must be a number')
  if (!Number.isInteger(num)) return false

  if (num <= 1) return false

  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false
  }

  return true
}

export function shippingCost(weight, coupon = '') {
  if (typeof weight !== 'number') throw new Error('Weight must be a number')
  if (typeof coupon !== 'string') throw new Error('Coupon must be a string')
  if (weight <= 0) throw new Error('Weight must be greater than 0')

  if (coupon === 'FREESHIPPING') return 0

  if (weight <= 1) return 3.99
  if (weight <= 5) return 5.99
  if (weight <= 20) return 8.99

  return 14.99
}
