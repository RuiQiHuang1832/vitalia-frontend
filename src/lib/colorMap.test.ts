import { getNameColors, COLORS } from './colorMap'

describe('getNameColors', () => {
  it('returns the same color for the same name', () => {
    const first = getNameColors('Ben')
    const second = getNameColors('Ben')
    expect(first).toEqual(second)
  })

  it('returns different colors for different starting letters', () => {
    const alice = getNameColors('Alice')
    const ben = getNameColors('Ben')
    expect(alice).not.toEqual(ben)
  })

  it('is case-insensitive and trims whitespace', () => {
    const normal = getNameColors('Alice')
    const messy = getNameColors('   alice   ')
    expect(normal).toEqual(messy)
  })

  it('returns first color for empty string', () => {
    const result = getNameColors('')

    expect(result).toEqual(COLORS[0])
  })

  it('returns a valid color from COLORS', () => {
    const result = getNameColors('Zach')

    expect(COLORS).toContainEqual(result)
  })
})
