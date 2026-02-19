// playwright.config.ts
import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1600, height: 1000 },
  },
})
