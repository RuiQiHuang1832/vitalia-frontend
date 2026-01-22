import '@testing-library/jest-dom'
import { vi } from 'vitest'

export const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: mockReplace,
    refresh: vi.fn(),
    back: vi.fn(),
  }),
}))

global.fetch = vi.fn()
