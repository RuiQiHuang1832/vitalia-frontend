import { test, expect } from '@playwright/test'
import { loginAsProvider } from './utils/login'

test('user can log in successfully', async ({ page }) => {
  await loginAsProvider(page)

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('My Day')).toBeVisible()
})
