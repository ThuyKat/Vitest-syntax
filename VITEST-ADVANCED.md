# Vitest Advanced Reference

Additional Vitest APIs and matchers not covered in the main [README.md](README.md). Same structure: click any item in the table of contents to jump to its detailed section with examples.

---

## Table of Contents

### 1. Additional Matchers
| Matcher | Description |
|---------|-------------|
| [`toBeNull`](#tobenull) | Check for `null` |
| [`toBeUndefined`](#tobeundefined) | Check for `undefined` |
| [`toBeNaN`](#tobenan) | Check for `NaN` |
| [`toBeGreaterThan`](#tobegreaterthan) | Number is greater than expected |
| [`toBeGreaterThanOrEqual`](#tobegreaterthanorequal) | Number is greater than or equal |
| [`toBeLessThanOrEqual`](#tobelessthanorequal) | Number is less than or equal |
| [`toBeCloseTo`](#tobecloseto) | Floating point comparison |
| [`toMatch`](#tomatch) | Regex or substring match on strings |
| [`toMatchObject`](#tomatchobject) | Recursive partial object match |
| [`toStrictEqual`](#tostrictequal) | Stricter deep equality than `toEqual` |
| [`toMatchSnapshot`](#tomatchsnapshot) | Snapshot testing |
| [`toMatchInlineSnapshot`](#tomatchinlinesnapshot) | Inline snapshot testing |
| [`expect.stringContaining`](#expectstringcontaining) | Asymmetric string partial match |
| [`expect.stringMatching`](#expectstringmatching) | Asymmetric regex match on strings |
| [`expect.arrayContaining`](#expectarraycontaining) | Asymmetric partial array match |

### 2. Lifecycle Hooks
| Hook | Description |
|------|-------------|
| [`beforeEach`](#beforeeach) | Run before each test |
| [`afterEach`](#aftereach) | Run after each test |
| [`beforeAll`](#beforeall) | Run once before all tests in a suite |
| [`afterAll`](#afterall) | Run once after all tests in a suite |

### 3. Test Organization
| API | Description |
|-----|-------------|
| [`it.skip` / `describe.skip`](#itskip--describeskip) | Skip tests temporarily |
| [`it.only` / `describe.only`](#itonly--describeonly) | Run only specific tests |
| [`it.todo`](#ittodo) | Placeholder for future tests |
| [`describe.concurrent`](#describeconcurrent) | Run tests in parallel |

### 4. Advanced Mocks & Timers
| API / Matcher | Description |
|---------------|-------------|
| [`mockReset`](#mockreset) | Reset mock and remove implementation |
| [`mockRestore`](#mockrestore) | Restore original implementation |
| [`mockClear` vs `mockReset` vs `mockRestore`](#mockclear-vs-mockreset-vs-mockrestore) | Comparison of all three |
| [`mockReturnValue`](#mockreturnvalue) | Set a fixed return value |
| [`mockReturnValueOnce`](#mockreturnvalueonce) | Set a one-time return value |
| [`mockResolvedValue`](#mockresolvedvalue) | Mock async resolved value |
| [`mockRejectedValue`](#mockrejectedvalue) | Mock async rejected value |
| [`vi.useFakeTimers`](#viusefaketimers) | Replace real timers with fake ones |
| [`vi.advanceTimersByTime`](#viadvancetimers) | Fast-forward fake timers |
| [`vi.useRealTimers`](#viuserealtimers) | Restore real timers |
| [`.mock.calls`](#mockcalls) | Access arguments from each call |
| [`toHaveBeenCalled`](#tohavebeencalled) | Assert called at least once |
| [`toHaveBeenLastCalledWith`](#tohavebeenlastcalledwith) | Assert arguments of the last call |
| [`toHaveBeenNthCalledWith`](#tohavebeennthcalledwith) | Assert arguments of the Nth call |
| [`toHaveLastReturnedWith`](#tohavelastreturnedwith) | Assert return value of the last call |
| [`toHaveNthReturnedWith`](#tohaventhreturnedwith) | Assert return value of the Nth call |

### 5. Utilities & Configuration
| API | Description |
|-----|-------------|
| [`expect.assertions`](#expectassertions) | Assert expected number of assertions |
| [`expect.hasAssertions`](#expecthasassertions) | Assert at least one assertion ran |
| [`expect.extend`](#expectextend) | Create custom matchers |
| [`vitest.config.js`](#vitestconfigjs) | Configuration file |

---

## 1. Additional Matchers

### `toBeNull`

Asserts a value is exactly `null`. More explicit than `toBe(null)`.

```js
function findUser(id) {
  if (id === 999) return null
  return { id, name: 'Ash' }
}

expect(findUser(999)).toBeNull()
expect(findUser(1)).not.toBeNull()
```

---

### `toBeUndefined`

Asserts a value is exactly `undefined`.

```js
const user = { name: 'Ash' }

expect(user.age).toBeUndefined()
expect(user.name).not.toBeUndefined()
```

---

### `toBeNaN`

Asserts a value is `NaN`. Needed because `NaN !== NaN` in JavaScript, so `toBe(NaN)` won't work.

```js
expect(Number('pikachu')).toBeNaN()
expect(0 / 0).toBeNaN()
expect(42).not.toBeNaN()
```

---

### `toBeGreaterThan`

Asserts a number is strictly greater than the expected value.

```js
expect(10).toBeGreaterThan(5)
expect(cards.length).toBeGreaterThan(0)
```

---

### `toBeGreaterThanOrEqual`

Asserts a number is greater than or equal to the expected value.

```js
expect(10).toBeGreaterThanOrEqual(10)
expect(cards.length).toBeGreaterThanOrEqual(52)
```

---

### `toBeLessThanOrEqual`

Asserts a number is less than or equal to the expected value.

```js
expect(5).toBeLessThanOrEqual(10)
expect(hand.length).toBeLessThanOrEqual(7)
```

---

### `toBeCloseTo`

Compares floating point numbers with a precision tolerance. Solves the classic `0.1 + 0.2 !== 0.3` problem.

```js
// this would FAIL with toBe:
// expect(0.1 + 0.2).toBe(0.3)  // 0.30000000000000004 !== 0.3

// toBeCloseTo handles floating point:
expect(0.1 + 0.2).toBeCloseTo(0.3)

// optional second argument = number of decimal digits to check
expect(0.1 + 0.2).toBeCloseTo(0.3, 5) // 5 decimal places
```

---

### `toMatch`

Asserts a string matches a regex pattern or contains a substring.

```js
// regex match
expect('Hello World').toMatch(/world/i)
expect('Error: file not found').toMatch(/error/i)

// substring match
expect('Hello World').toMatch('World')
```

> **Note:** `toMatch` works on strings. For arrays, use `toContain`.

---

### `toMatchObject`

Recursively checks that an object contains at least the expected properties. Like `expect.objectContaining` but can be used directly and works recursively on nested objects.

```js
const user = {
  name: 'Ash',
  age: 10,
  pokemon: { name: 'Pikachu', type: 'Electric', level: 25 },
}

// passes - user has at least these properties
expect(user).toMatchObject({
  name: 'Ash',
  pokemon: { type: 'Electric' },  // nested partial match works
})

// also works on arrays of objects
const users = [{ name: 'Ash' }, { name: 'Misty' }]
expect(users).toMatchObject([{ name: 'Ash' }, { name: 'Misty' }])
```

> **vs `toEqual`:** `toEqual` requires exact match. `toMatchObject` allows extra properties.

---

### `toStrictEqual`

Stricter than `toEqual`. Checks:
1. Objects have the same type (not just same shape)
2. `undefined` properties are not ignored
3. Sparse array holes are not treated as `undefined`

```js
class User {
  constructor(name) { this.name = name }
}

// toEqual passes - same shape
expect(new User('Ash')).toEqual({ name: 'Ash' })

// toStrictEqual fails - different types (User vs plain object)
expect(new User('Ash')).not.toStrictEqual({ name: 'Ash' })

// undefined properties matter with toStrictEqual
expect({ name: 'Ash', age: undefined }).toEqual({ name: 'Ash' })      // passes
expect({ name: 'Ash', age: undefined }).not.toStrictEqual({ name: 'Ash' }) // fails
```

---

### `toMatchSnapshot`

Saves a snapshot of a value to a `.snap` file on first run. On subsequent runs, compares against the saved snapshot.

```js
it('matches the card snapshot', () => {
  const card = { value: 'Ace', suit: 'Spades' }

  // first run: creates __snapshots__/file.test.js.snap
  // next runs: compares against saved snapshot
  expect(card).toMatchSnapshot()
})
```

> Update snapshots with `npx vitest --update` or press `u` in watch mode.

---

### `toMatchInlineSnapshot`

Like `toMatchSnapshot`, but stores the snapshot inline in the test file itself. Vitest fills in the snapshot automatically on first run.

```js
it('matches inline snapshot', () => {
  const card = { value: 'Ace', suit: 'Spades' }

  // Vitest will auto-fill this on first run:
  expect(card).toMatchInlineSnapshot(`
    {
      "suit": "Spades",
      "value": "Ace",
    }
  `)
})
```

> Useful for small values where you want the expected output visible directly in the test.

---

### `expect.stringContaining`

Asymmetric matcher that checks a string contains a substring. Use inside `toEqual`, `toHaveBeenCalledWith`, etc.

```js
expect('Hello World').toEqual(expect.stringContaining('World'))

// useful inside object matching
expect(error).toEqual({
  message: expect.stringContaining('not found'),
  code: 404,
})
```

---

### `expect.stringMatching`

Asymmetric matcher that checks a string matches a regex pattern.

```js
expect('2024-01-15').toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/))

// useful inside object matching
expect(user).toEqual({
  name: expect.stringMatching(/^[A-Z]/), // starts with capital letter
  email: expect.stringMatching(/@/),
})
```

---

### `expect.arrayContaining`

Asymmetric matcher that checks an array contains at least the specified elements, in any order.

```js
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']

// passes - array contains at least these items (order doesn't matter)
expect(suits).toEqual(expect.arrayContaining(['Spades', 'Hearts']))

// combine with .not
expect(suits).toEqual(expect.not.arrayContaining(['Joker']))
```

---

## 2. Lifecycle Hooks

### `beforeEach`

Runs before each test in the current `describe` block. Use for setup that needs a fresh state per test.

```js
import { describe, it, expect, beforeEach } from 'vitest'

describe('deck', () => {
  let cards

  beforeEach(() => {
    // fresh deck before every test
    cards = createCards({ suits, values })
  })

  it('has 52 cards', () => {
    expect(cards).toHaveLength(52)
  })

  it('can remove a card without affecting next test', () => {
    cards.pop()
    expect(cards).toHaveLength(51)
    // next test still gets 52 because beforeEach runs again
  })
})
```

---

### `afterEach`

Runs after each test. Use for cleanup (clearing mocks, resetting state, closing connections).

```js
import { describe, it, afterEach, vi } from 'vitest'

describe('with mocks', () => {
  afterEach(() => {
    vi.restoreAllMocks() // restore all spies/mocks after each test
  })

  it('test one', () => {
    const spy = vi.spyOn(console, 'log')
    // ...
  })

  it('test two', () => {
    // console.log is fully restored here
  })
})
```

---

### `beforeAll`

Runs once before all tests in the current `describe` block. Use for expensive setup that can be shared (database connections, loading fixtures).

```js
import { describe, it, expect, beforeAll } from 'vitest'

describe('loadDeck', () => {
  let standardDeck

  beforeAll(async () => {
    // load once, share across all tests
    standardDeck = await loadDeck('standard')
  })

  it('has 4 suits', () => {
    expect(standardDeck.suits).toHaveLength(4)
  })

  it('has 13 values', () => {
    expect(standardDeck.values).toHaveLength(13)
  })
})
```

> **Warning:** Be careful with shared state - if one test mutates `standardDeck`, it affects subsequent tests. Use `beforeEach` if tests need independent copies.

---

### `afterAll`

Runs once after all tests in the current `describe` block. Use for teardown (closing connections, cleaning up temp files).

```js
import { describe, afterAll } from 'vitest'

describe('database tests', () => {
  afterAll(async () => {
    await db.disconnect()
  })

  // tests...
})
```

> **Execution order:**
> `beforeAll` -> (`beforeEach` -> test -> `afterEach`) x N -> `afterAll`

---

## 3. Test Organization

### `it.skip` / `describe.skip`

Temporarily skip a test or an entire suite. Skipped tests show as "skipped" in the output but don't run.

```js
// skip a single test
it.skip('this test is temporarily disabled', () => {
  expect(true).toBe(true)
})

// skip an entire suite
describe.skip('features under construction', () => {
  it('test 1', () => { /* won't run */ })
  it('test 2', () => { /* won't run */ })
})
```

> **Tip:** Use `skip` instead of commenting out tests - skipped tests are visible in reports so you don't forget about them.

---

### `it.only` / `describe.only`

Run only the specified test(s) or suite(s). All others are skipped. Useful for debugging a single test.

```js
// only this test runs in the file
it.only('focus on this test', () => {
  expect(isPrime(7)).toBe(true)
})

it('this will be skipped', () => {
  expect(isPrime(4)).toBe(false)
})

// only this suite runs
describe.only('debugging this suite', () => {
  it('test 1', () => { /* runs */ })
  it('test 2', () => { /* runs */ })
})
```

> **Warning:** Don't commit `.only` to your repo - it silently skips other tests. Some lint rules can catch this.

---

### `it.todo`

Placeholder for tests you plan to write later. Shows up as "todo" in the test output.

```js
it.todo('should handle empty deck')
it.todo('should throw when dealing more cards than available')
it.todo('should support custom deck sizes')
```

> No callback function needed - just the test name as a reminder.

---

### `describe.concurrent`

Runs all tests in the suite concurrently (in parallel) instead of sequentially.

```js
describe.concurrent('independent tests', () => {
  it('test A', async () => {
    const result = await fetchDataA()
    expect(result).toBeDefined()
  })

  it('test B', async () => {
    const result = await fetchDataB()
    expect(result).toBeDefined()
  })
})
```

> **Note:** Only use when tests don't share or mutate state. Tests that depend on each other should remain sequential.

---

## 4. Advanced Mocks & Timers

### `mockReset`

Resets a mock: clears all tracking (like `mockClear`) **and** removes the mock implementation, making it return `undefined`.

```js
const mockFn = vi.fn(() => 'hello')

mockFn()
expect(mockFn).toHaveReturnedWith('hello')

mockFn.mockReset()

mockFn()
expect(mockFn).toHaveReturnedWith(undefined) // implementation removed
```

---

### `mockRestore`

Restores the original implementation. Only meaningful for spies created with `vi.spyOn`.

```js
const spy = vi.spyOn(console, 'log')

console.log('test') // tracked by spy, but still logs

spy.mockRestore()

// console.log is now fully original again, no tracking
```

---

### `mockClear` vs `mockReset` vs `mockRestore`

| Method | Clears tracking | Removes implementation | Restores original |
|--------|:-:|:-:|:-:|
| `mockClear` | Yes | No | No |
| `mockReset` | Yes | Yes | No |
| `mockRestore` | Yes | Yes | Yes |

```js
const spy = vi.spyOn(Math, 'random').mockReturnValue(0.5)

// mockClear: calls/results cleared, still returns 0.5
spy.mockClear()
expect(Math.random()).toBe(0.5)

// mockReset: calls/results cleared, returns undefined
spy.mockReset()
expect(Math.random()).toBeUndefined()

// mockRestore: original Math.random() is back
spy.mockRestore()
expect(Math.random()).not.toBe(0.5) // real random number
```

---

### `mockReturnValue`

Sets a permanent return value for a mock function.

```js
const mockFn = vi.fn()

mockFn.mockReturnValue(42)

expect(mockFn()).toBe(42)
expect(mockFn()).toBe(42) // always returns 42
```

---

### `mockReturnValueOnce`

Sets a return value for a single call only. Chainable for sequential return values.

```js
const mockFn = vi.fn()

mockFn
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default')

expect(mockFn()).toBe('first')
expect(mockFn()).toBe('second')
expect(mockFn()).toBe('default') // falls back to mockReturnValue
expect(mockFn()).toBe('default')
```

---

### `mockResolvedValue`

Shorthand for mocking a function that returns a resolved promise.

```js
const mockFetch = vi.fn()

// instead of: mockFetch.mockReturnValue(Promise.resolve({ data: 'hello' }))
mockFetch.mockResolvedValue({ data: 'hello' })

const result = await mockFetch()
expect(result).toEqual({ data: 'hello' })
```

> Also has `mockResolvedValueOnce` for single-use.

---

### `mockRejectedValue`

Shorthand for mocking a function that returns a rejected promise.

```js
const mockFetch = vi.fn()

mockFetch.mockRejectedValue(new Error('Network error'))

await expect(mockFetch()).rejects.toThrow('Network error')
```

> Also has `mockRejectedValueOnce` for single-use.

---

### `vi.useFakeTimers`

Replaces `setTimeout`, `setInterval`, `Date`, and other timer functions with fake versions you can control.

```js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('timer tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs callback after timeout', () => {
    const callback = vi.fn()

    setTimeout(callback, 1000)

    expect(callback).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1000)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
```

---

### `vi.advanceTimersByTime`

Fast-forwards fake timers by the specified number of milliseconds, executing any scheduled callbacks along the way.

```js
vi.useFakeTimers()

const callback = vi.fn()

setTimeout(callback, 500)
setTimeout(callback, 1500)

vi.advanceTimersByTime(1000) // fast-forward 1 second

expect(callback).toHaveBeenCalledTimes(1) // only the 500ms one fired

vi.advanceTimersByTime(500) // another 500ms

expect(callback).toHaveBeenCalledTimes(2) // now the 1500ms one fired too
```

> Other useful timer methods:
> - `vi.advanceTimersToNextTimer()` - advance to the next scheduled timer
> - `vi.runAllTimers()` - execute all pending timers immediately

---

### `vi.useRealTimers`

Restores the original timer functions. Always call this in `afterEach` when using fake timers.

```js
afterEach(() => {
  vi.useRealTimers()
})
```

---

### `.mock.calls`

Every mock/spy has a `.mock.calls` array that records the arguments of each call.

```js
const mockFn = vi.fn()

mockFn('hello', 42)
mockFn('world')

// .mock.calls is an array of argument arrays
expect(mockFn.mock.calls).toEqual([
  ['hello', 42],  // first call arguments
  ['world'],      // second call arguments
])

// access specific call's arguments
expect(mockFn.mock.calls[0][0]).toBe('hello')
expect(mockFn.mock.calls[1][0]).toBe('world')
```

---

### `toHaveBeenCalled`

Asserts a mock was called at least once. No count specified.

```js
const mockFn = vi.fn()

mockFn()

expect(mockFn).toHaveBeenCalled()
```

> Use `toHaveBeenCalledTimes(n)` when you need to assert an exact count.

---

### `toHaveBeenLastCalledWith`

Asserts the arguments of the most recent call to a mock.

```js
const mockFn = vi.fn()

mockFn('first')
mockFn('second')
mockFn('third')

expect(mockFn).toHaveBeenLastCalledWith('third')
```

---

### `toHaveBeenNthCalledWith`

Asserts the arguments of the Nth call (1-indexed) to a mock.

```js
const mockFn = vi.fn()

mockFn('first')
mockFn('second')
mockFn('third')

expect(mockFn).toHaveBeenNthCalledWith(1, 'first')
expect(mockFn).toHaveBeenNthCalledWith(2, 'second')
expect(mockFn).toHaveBeenNthCalledWith(3, 'third')
```

---

### `toHaveLastReturnedWith`

Asserts the return value of the most recent call to a mock.

```js
const mockFn = vi.fn()
  .mockReturnValueOnce('a')
  .mockReturnValueOnce('b')

mockFn()
mockFn()

expect(mockFn).toHaveLastReturnedWith('b')
```

---

### `toHaveNthReturnedWith`

Asserts the return value of the Nth call (1-indexed) to a mock.

```js
const mockFn = vi.fn()
  .mockReturnValueOnce('a')
  .mockReturnValueOnce('b')
  .mockReturnValueOnce('c')

mockFn()
mockFn()
mockFn()

expect(mockFn).toHaveNthReturnedWith(1, 'a')
expect(mockFn).toHaveNthReturnedWith(2, 'b')
expect(mockFn).toHaveNthReturnedWith(3, 'c')
```

---

## 5. Utilities & Configuration

### `expect.assertions`

Declares how many assertions should be called during a test. If the count doesn't match, the test fails. Useful for async tests to ensure callbacks actually ran.

```js
it('handles async errors correctly', async () => {
  expect.assertions(2)

  try {
    await loadDeck('invalid-id')
  } catch (error) {
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toMatch(/not found/i)
  }
  // if loadDeck doesn't throw, only 0 assertions run -> test fails
})
```

---

### `expect.hasAssertions`

Asserts that at least one assertion was called during the test. Simpler alternative to `expect.assertions(n)`.

```js
it('runs at least one assertion', () => {
  expect.hasAssertions()

  const items = [1, 2, 3]
  items.forEach(item => {
    expect(item).toBeGreaterThan(0)
  })
})
```

---

### `expect.extend`

Register custom matchers to extend Vitest's `expect` with your own assertions.

```js
import { expect } from 'vitest'

expect.extend({
  toBeValidCard(received) {
    const hasValue = typeof received.value === 'string'
    const hasSuit = typeof received.suit === 'string'
    const pass = hasValue && hasSuit

    return {
      pass,
      message: () =>
        pass
          ? `expected ${JSON.stringify(received)} not to be a valid card`
          : `expected ${JSON.stringify(received)} to be a valid card with { value, suit }`,
    }
  },
})

// now use it in tests:
it('creates valid cards', () => {
  const card = { value: 'Ace', suit: 'Spades' }
  expect(card).toBeValidCard()
})
```

> **Tip:** Place custom matchers in a setup file and reference it in `vitest.config.js` via `setupFiles`.

---

### `vitest.config.js`

Vitest configuration file. Place it in the project root. Supports all Vite config plus Vitest-specific options.

```js
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // global test settings
    globals: true,               // use describe/it/expect without imports
    environment: 'node',         // 'node' | 'jsdom' | 'happy-dom'

    // file patterns
    include: ['tests/**/*.test.js'],
    exclude: ['node_modules'],

    // setup files run before each test file
    setupFiles: ['./tests/setup.js'],

    // coverage
    coverage: {
      provider: 'v8',            // 'v8' | 'istanbul'
      reporter: ['text', 'html'],
      include: ['src/**/*.js'],
    },

    // timeouts
    testTimeout: 5000,

    // reporter
    reporters: ['verbose'],
  },
})
```

> **`globals: true`** lets you use `describe`, `it`, `expect`, `vi` without importing them in every test file.
