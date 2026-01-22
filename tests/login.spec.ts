import { expect, test } from '@playwright/test'

test('user can log in successfully', async ({ page }) => {
  // Mock the login API response
  await page.route('**/auth/login', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: { role: 'PROVIDER' } }),
    })
  })

  await page.route('**/auth/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        user: { id: 1, email: 'test@example.com', role: 'PROVIDER' },
      }),
    })
  })

  // Navigate to your login page
  await page.goto('http://localhost:3000/login')

  // Fill in the form
  await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')
  await page.getByRole('textbox', { name: 'Password' }).fill('password123')

  // Click the sign-in button
  await page.click('button:has-text("Sign in")')

  // Assert navigation to the dashboard or some post-login page
  await expect(page).toHaveURL('/dashboard')

  // Assert some dashboard content is visible
  await expect(page.getByText('My Day')).toBeVisible()
})
