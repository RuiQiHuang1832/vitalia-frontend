import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateAge } from './utils'

describe('calculateAge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-03-10'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns correct age when birthday has passed', () => {
    expect(calculateAge('1995-01-15')).toBe(30)
  })

  it('returns correct age when birthday has not passed', () => {
    expect(calculateAge('1995-12-20')).toBe(29)
  })
})
