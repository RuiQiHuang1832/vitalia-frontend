import { mockReplace } from '@/vitest/vitest.setup'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginForm from './LoginForm'
describe('LoginForm error state', () => {
  it('shows error message when login fails', async () => {
    const user = userEvent.setup()

    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'testtest.com')
    await user.type(screen.getByLabelText(/password/i), 'zxcv1234')

    await user.click(screen.getByRole('button', { name: /sign in/i }))

    // error appears asynchronously
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email address')
  })
})

describe('LoginForm Success Path', () => {
  it('redirects to /dashboard on successful provider login', async () => {
    const user = userEvent.setup()
    mockReplace.mockClear()

    // 2. Mock a successful fetch response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ user: { role: 'PROVIDER' } }),
    } as Response)

    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@test.com')
    await user.type(screen.getByLabelText(/password/i), 'password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/dashboard'))
  })
})
