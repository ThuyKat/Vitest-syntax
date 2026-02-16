# Vitest Unit Testing - Syntax Reference

A hands-on reference for Vitest unit testing syntax and patterns, based on the tutorials on youtube. Each concept includes a working example which can run with `npm test`.

```js
// Quick example
import { describe, it, expect } from 'vitest'

describe('myFunction', () => {
  it('returns the correct value', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

## Setup

```bash
npm install
npm test
```

---

## Table of Contents

### 1. Basic Matchers
| Matcher | Description |
|---------|-------------|
| [`toBe`](#tobe) | Strict equality (`===`) for primitives |
| [`toEqual`](#toequal) | Deep equality for objects/arrays (reference types) |
| [`toBeTruthy`](#tobetruthy) | Check value is truthy |
| [`toBeFalsy`](#tobefalsy) | Check value is falsy |
| [`toBeTypeOf`](#tobetypeof) | Check the type of a value |
| [`toHaveLength`](#tohavelength) | Check array or string length |
| [`toHaveProperty`](#tohaveproperty) | Check if object has a property |
| [`toBeDefined`](#tobedefined) | Check value is not `undefined` |
| [`toBeInstanceOf`](#tobeinstanceof) | Check if value is instance of a class |
| [`toBeLessThan`](#tobelessthan) | Numeric comparison |
| [`toContain`](#tocontain) | Check if array/string contains a value |
| [`.not`](#not) | Negate any matcher |
| [`Array.isArray().toBe()`](#arrayisarraytobe) | Check if a value is an array |
| [`toEqual` + `expect.objectContaining`](#toequal--expectobjectcontaining) | Partial deep match on objects |
| [`toThrow`](#tothrow) | Assert a function throws an error |
| [`it.each`](#iteach) | Run the same test with different data |
| [`expect.objectContaining`](#expectobjectcontaining) | Partial object matching |
| [`expect.any`](#expectany) | Match any value of a given type |

### 2. Async Testing
| Matcher / Pattern | Description |
|-------------------|-------------|
| [`async / await`](#async--await) | Await async functions in tests |
| [`resolves`](#resolves) | Assert a promise resolves |
| [`rejects`](#rejects) | Assert a promise rejects |

### 3. Mocks
| API / Matcher | Description |
|---------------|-------------|
| [`vi.mock`](#vimock) | Mock an entire module |
| [`vi.importActual`](#viimportactual) | Import the real module inside a mock |
| [`vi.fn`](#vifn) | Create a mock function |
| [`mockClear`](#mockclear) | Reset call and return tracking |
| [`toHaveBeenCalledTimes`](#tohavebeencalledtimes) | Assert how many times a mock was called |
| [`toHaveReturnedWith`](#tohavereturnedwith) | Assert what a mock returned |

### 4. Spies
| API / Matcher | Description |
|---------------|-------------|
| [`vi.spyOn`](#vispyon) | Spy on a method of an existing module/object |
| [`toHaveBeenCalledWith`](#tohavebeencalledwith) | Assert what arguments a spy was called with |
| [`.mock.results`](#mockresults) | Access return values from spy calls |
| [`.mock.invocationCallOrder`](#mockinvocationcallorder) | Check the order spies were called in |

---

## 1. Basic Matchers

### `toBe`

Checks strict equality using `===`. Use for primitives (strings, numbers, booleans).

```js
expect(longestString('pikachu', 'snorlax')).toBe('pikachu')
expect(isPrime(2)).toBe(true)
expect(isPrime(4)).toBe(false)
```

> **File:** `tests/examples.test.js`

---

### `toEqual`

Checks deep equality. Use for comparing **reference types** (objects, arrays) where reference identity doesn't matter. Unlike `toBe` which uses `===` (same reference in memory), `toEqual` recursively compares all properties/elements by value.

```js
// toBe fails for reference types even with identical content:
// { a: 1 } === { a: 1 }  // false (different references)

// toEqual compares by value instead:
const deck = await loadDeck()

expect(deck).toEqual(
  expect.objectContaining({
    suits: expect.any(Array),
    values: expect.any(Array),
  })
)
```

> **Note:** Use `toBe` for primitives (strings, numbers, booleans). Use `toEqual` for objects and arrays.

> **File:** `tests/loadDeck.test.js`

---

### `toBeTruthy`

Asserts a value is truthy (i.e. evaluates to `true` in a boolean context). In JavaScript, everything is truthy except `false`, `0`, `""`, `null`, `undefined`, and `NaN`.

```js
expect(1).toBeTruthy()
expect('hello').toBeTruthy()
expect([]).toBeTruthy()        // empty array is truthy
expect({}).toBeTruthy()        // empty object is truthy
```

---

### `toBeFalsy`

Asserts a value is falsy (i.e. evaluates to `false` in a boolean context). Falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`.

```js
expect(0).toBeFalsy()
expect('').toBeFalsy()
expect(null).toBeFalsy()
expect(undefined).toBeFalsy()
```

---

### `toBeTypeOf`

Checks the type of a value using `typeof`.

```js
expect(shippingCost(2)).toBeTypeOf('number')

const sample = cards[0]
expect(sample).toBeTypeOf('object')
```

> **Files:** `tests/examples.test.js`, `tests/createCards.test.js`

---

### `toHaveLength`

Asserts the `.length` property of arrays or strings.

```js
expect(cards).toHaveLength(52)
expect(deck.suits).toHaveLength(4)
expect(shuffled).toHaveLength(52)
```

> **Files:** `tests/createCards.test.js`, `tests/loadDeck.test.js`, `tests/shuffle.test.js`

---

### `toHaveProperty`

Checks if an object contains a specific property.

```js
const sample = cards[0]

expect(sample).toHaveProperty('suit')
expect(sample).toHaveProperty('value')
```

> **File:** `tests/createCards.test.js`

---

### `toBeDefined`

Asserts a value is not `undefined`. Useful for checking search results exist.

```js
const tenOfHearts = cards.find(c => c.value === '10' && c.suit === 'Hearts')
expect(tenOfHearts).toBeDefined()
```

> **File:** `tests/createCards.test.js`

---

### `toBeInstanceOf`

Checks if a value is an instance of a class or constructor.

```js
const result = loadDeck()
expect(result).toBeInstanceOf(Promise)
```

> **File:** `tests/loadDeck.test.js`

---

### `toBeLessThan`

Numeric comparison. Useful for asserting randomization changed the order.

```js
const samePositions = shuffled.filter((card, i) => card === originalOrder[i])
expect(samePositions.length).toBeLessThan(52)
```

> **File:** `tests/shuffle.test.js`

---

### `toContain`

Checks if an array contains a specific item or if a string contains a substring.

```js
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

expect(suits).toContain('Hearts')
expect(suits).toContain('Spades')

// also works with strings
expect('Hello World').toContain('World')
```

---

### `.not`

Negates any matcher by chaining `.not` before it. Works with every matcher.

```js
// .not.toContain - assert an item is NOT in the array
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
expect(suits).not.toContain('Joker')

// .not.toBe
expect(isPrime(4)).not.toBe(true)

// .not.toEqual
expect({ a: 1 }).not.toEqual({ a: 2 })

// .not.toBeDefined
expect(undefined).not.toBeDefined()
```

---

### `Array.isArray().toBe()`

A pattern that uses JavaScript's built-in `Array.isArray()` inside `expect` to check if a value is an array. Useful when you need to explicitly verify the return type is an array, not just any object.

```js
const cards = createCards({ suits, values })

// wrap Array.isArray() in expect, then match with toBe
expect(Array.isArray(cards)).toBe(true)
```

> **Note:** This is a common pattern rather than a Vitest-specific matcher. An alternative is `expect(cards).toBeInstanceOf(Array)`.

> **File:** `tests/createCards.test.js`

---

### `toEqual` + `expect.objectContaining`

A powerful combination for asserting that an object **partially matches** a given shape. `toEqual` performs deep comparison, while `expect.objectContaining` allows extra properties to exist without failing. Nest `expect.any()` inside to match by type rather than exact value.

```js
const deck = await loadDeck()

// assert deck has suits (any array) and values (any array)
// without caring about the exact contents
expect(deck).toEqual(
  expect.objectContaining({
    suits: expect.any(Array),
    values: expect.any(Array),
  })
)
```

> **When to use which:**
> - `toEqual({ ... })` - object must match **exactly** (no extra properties allowed)
> - `toEqual(expect.objectContaining({ ... }))` - object must have **at least** these properties (extra properties are OK)

> **File:** `tests/loadDeck.test.js`

---

### `toThrow`

Asserts that a function throws an error. Optionally match the error message with a string or regex.

```js
// basic - just check it throws
expect(() => createCards({ suits: 'not an array', values })).toThrow()

// with regex - match error message pattern
expect(badCall).toThrow(/number/i)

// with lookahead regex - flexible message matching
expect(() => shippingCost(0)).toThrow(/(?=.*weight)(?=.*0)/i)
```

> **Important:** Wrap the throwing function in `() =>` so the error is caught by `expect`.

> **Files:** `tests/examples.test.js`, `tests/createCards.test.js`

---

### `it.each`

Run the same test logic with different sets of data. Avoids duplicating test code.

```js
it.each([
  { weight: 0.5, expected: 3.99 },
  { weight: 3,   expected: 5.99 },
  { weight: 10,  expected: 8.99 },
  { weight: 50,  expected: 14.99 },
])('charges $expected for weight $weight', ({ weight, expected }) => {
  expect(shippingCost(weight)).toBe(expected)
})
```

> Use `$propertyName` in the test name to interpolate values from each data row.

> **File:** `tests/examples.test.js`

---

### `expect.objectContaining`

An asymmetric matcher that checks an object contains at least the specified properties. Does not require an exact match.

```js
expect(deck).toEqual(
  expect.objectContaining({
    suits: expect.any(Array),
    values: expect.any(Array),
  })
)
```

> **File:** `tests/loadDeck.test.js`

---

### `expect.any`

An asymmetric matcher that matches any value created by the given constructor (e.g. `Array`, `String`, `Number`).

```js
expect(deck).toEqual(
  expect.objectContaining({
    suits: expect.any(Array),   // matches any array
    values: expect.any(Array),
  })
)
```

> **File:** `tests/loadDeck.test.js`

---

## 2. Async Testing

### `async / await`

Use `async` test functions to `await` promises before asserting results.

```js
it('resolves a deck', async () => {
  const deck = await loadDeck()

  expect(deck.suits).toHaveLength(4)
  expect(deck.values).toHaveLength(13)
})
```

> **File:** `tests/loadDeck.test.js`

---

### `resolves`

Chain `.resolves` to unwrap a resolved promise before matching.

```js
const result = loadDeck()

await expect(result).resolves.toBeDefined()
```

> **File:** `tests/loadDeck.test.js`

---

### `rejects`

Chain `.rejects` to assert a promise rejects with a specific error.

```js
const deck = loadDeck('unknown-id')

await expect(deck).rejects.toThrow(/not found/i)
```

> Don't forget `await` when using `.resolves` or `.rejects`.

> **File:** `tests/loadDeck.test.js`

---

## 3. Mocks

### `vi.mock`

Replaces an entire module's exports with mock implementations. Vitest hoists `vi.mock` calls to the top of the file automatically.

```js
import { vi } from 'vitest'
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
```

> This replaces `logDealRound` with a spy while keeping other exports from the module intact.

> **File:** `tests/deal.test.js`

---

### `vi.importActual`

Inside a `vi.mock` factory, use `vi.importActual` to import the real module. Useful for selectively mocking only some exports.

```js
vi.mock('../src/helpers/loggers', async () => {
  const originals = await vi.importActual('../src/helpers/loggers')

  return {
    ...originals,                  // keep all real exports
    logDealRound: vi.fn(),         // override just this one
  }
})
```

> **File:** `tests/deal.test.js`

---

### `vi.fn`

Creates a mock function that records calls, arguments, and return values. Used inside `vi.mock` to replace module exports.

```js
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
```

> **File:** `tests/deal.test.js`

---

### `mockClear`

Resets all tracking on a mock (calls, results, instances) without removing the implementation. Call between tests to get clean counts.

```js
logDealRound.mockClear()

deal(cards, 5, 3)

expect(logDealRound).toHaveBeenCalledTimes(5)
```

> **File:** `tests/deal.test.js`

---

### `toHaveBeenCalledTimes`

Asserts how many times a mock function was called.

```js
deal(cards, 5, 3) // 5 rounds of dealing

expect(logDealRound).toHaveBeenCalledTimes(5)
```

> **File:** `tests/deal.test.js`

---

### `toHaveReturnedWith`

Asserts that a mock function returned a specific value at least once.

```js
expect(logDealRound).toHaveReturnedWith(true)
```

> **File:** `tests/deal.test.js`

---

## 4. Spies

### `vi.spyOn`

Wraps an existing method on a module or object so you can track calls without replacing the implementation. Unlike `vi.fn` (which creates a new function), `vi.spyOn` watches a real function.

```js
import { vi } from 'vitest'
import * as loggers from '../src/helpers/loggers'

// spy on the real function - it still runs, but calls are tracked
const spy = vi.spyOn(loggers, 'logDealRound')

deal(cards, 5, 3)

expect(spy).toHaveBeenCalledTimes(5)

// optionally override the implementation
spy.mockImplementation(() => 'mocked')
```

> **Note:** Use `vi.spyOn(module, 'methodName')` when you want to observe a real function. Use `vi.fn()` when you want to replace it entirely.

---

### `toHaveBeenCalledWith`

Asserts that a spy/mock was called with specific arguments at least once.

```js
const spy = vi.spyOn(loggers, 'logDealRound')

deal(cards, 5, 3)

// check it was called with the hands array and round number 1
expect(spy).toHaveBeenCalledWith(
  expect.any(Array),  // hands
  1                   // first round
)
```

---

### `.mock.results`

Every spy/mock has a `.mock.results` array that records the return value of each call. Each entry has `{ type, value }`.

```js
const spy = vi.spyOn(loggers, 'logDealRound')

deal(cards, 5, 3)

// access the return value of the first call
const firstReturn = spy.mock.results[0].value

// access all return values
spy.mock.results.forEach(result => {
  console.log(result.value)
})
```

> **Note:** `result.type` is `'return'` for normal returns or `'throw'` for exceptions.

---

### `.mock.invocationCallOrder`

Tracks the global order in which spies/mocks were called. Useful when testing that multiple spies are called in the correct sequence.

```js
const spyA = vi.spyOn(moduleA, 'funcA')
const spyB = vi.spyOn(moduleB, 'funcB')

doSomething()

// each spy records its call order number(s)
// lower number = called first
console.log(spyA.mock.invocationCallOrder) // e.g. [1, 3]
console.log(spyB.mock.invocationCallOrder) // e.g. [2, 4]

// assert spyA was called before spyB
expect(spyA.mock.invocationCallOrder[0])
  .toBeLessThan(spyB.mock.invocationCallOrder[0])
```
