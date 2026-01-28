import { describe, it, expect } from 'vitest'
import { getNameColors, COLORS } from './colorMap'

describe('getNameColors', () => {
  it('returns a deterministic color for the same name', () => {
    const first = getNameColors('Ben')
    const second = getNameColors('Ben')

    expect(first).toEqual(second)
  })

  it('returns different colors for different starting letters', () => {
    const alice = getNameColors('Alice')
    const ben = getNameColors('Ben')

    expect(alice).not.toEqual(ben)
  })

  it('handles lowercase and trims whitespace', () => {
    const normal = getNameColors('Alice')
    const messy = getNameColors('   alice   ')

    expect(messy).toEqual(normal)
  })

  it('returns the fallback color when name is empty', () => {
    const result = getNameColors('')

    expect(result).toEqual(COLORS[0])
  })

  it('always returns a valid color from the palette', () => {
    const result = getNameColors('Zach')

    expect(COLORS).toContainEqual(result)
  })
})
