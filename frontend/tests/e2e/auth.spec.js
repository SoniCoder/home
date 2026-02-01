import { test, expect, TEST_USER, clearAuthState } from './fixtures.js'

/**
 * Authentication tests for Shizuha Home
 *
 * Shizuha Home is unique in that it displays different content based on auth state:
 * - Unauthenticated users: See LandingPage with marketing content
 * - Authenticated users: See HomePage with personalized dashboard
 *
 * The login flow works as follows:
 * 1. User clicks "Sign in" on the landing page
 * 2. Redirects to /id/login
 * 3. User logs in at Shizuha ID (/id/login)
 * 4. After successful login, redirects to /home/ or /
 * 5. ConditionalHome component shows HomePage
 */

test.describe('Authentication', () => {

  test.describe('Landing Page (Unauthenticated)', () => {

    test('should show landing page when unauthenticated', async ({ page }) => {
      // Clear any existing auth state first
      await page.goto('/home/')
      await page.waitForLoadState('domcontentloaded')
      await clearAuthState(page)

      // Reload to see unauthenticated state
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Should show landing page hero content
      await expect(page.locator('h1').filter({ hasText: /One login|All your tools/i }).first()).toBeVisible({ timeout: 10000 })

      // Should have sign in link
      await expect(page.locator('a[href="/id/login"]').first()).toBeVisible()

      // Should have Get Started / register link
      await expect(page.locator('a[href="/id/register"]').first()).toBeVisible()
    })

    test('should show "Shizuha" branding in navbar', async ({ page }) => {
      await page.goto('/home/')
      await page.waitForLoadState('domcontentloaded')
      await clearAuthState(page)
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Check for Shizuha branding
      await expect(page.locator('text=Shizuha').first()).toBeVisible()
    })

    test('should have Products and Features navigation links', async ({ page }) => {
      await page.goto('/home/')
      await page.waitForLoadState('domcontentloaded')
      await clearAuthState(page)
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Check navigation links (desktop view)
      await expect(page.locator('a[href="#products"]').first()).toBeVisible()
      await expect(page.locator('a[href="#features"]').first()).toBeVisible()
    })

  })

  test.describe('Unified Login Flow', () => {

    test('should redirect to /id/login when clicking Sign in', async ({ page }) => {
      // Go to landing page
      await page.goto('/home/')
      await page.waitForLoadState('domcontentloaded')
      await clearAuthState(page)
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Click sign in link
      await page.locator('a[href="/id/login"]').first().click()

      // Should navigate to Shizuha ID login
      await page.waitForURL(/.*\/id\/login/, { timeout: 15000 })
      await expect(page.locator('h1')).toContainText('Shizuha ID')
    })

    test('should login with valid credentials and show dashboard', async ({ page }) => {
      // Start at Shizuha ID login with next parameter
      await page.goto('/id/login?next=/home/')

      // Wait for form to be ready
      await page.waitForSelector('input[id="username"]', { timeout: 10000 })

      // Fill in credentials
      await page.fill('input[id="username"]', TEST_USER.username)
      await page.fill('input[id="password"]', TEST_USER.password)

      // Click submit
      await page.click('button[type="submit"]')

      // Wait for successful login API response
      await page.waitForResponse(
        response => response.url().includes('/auth/login/') && response.ok(),
        { timeout: 15000 }
      )

      // Wait for redirect to home (handles /home/ or /)
      await page.waitForURL(/.*home.*|^\/$/, { timeout: 30000 })

      // Wait for page to load
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Verify we see the authenticated dashboard content
      // HomePage shows welcome message with greeting
      await expect(page.locator('h1').filter({ hasText: /Good (morning|afternoon|evening)/i }).first()).toBeVisible({ timeout: 15000 })
    })

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/id/login')

      // Wait for form
      await page.waitForSelector('input[id="username"]', { timeout: 10000 })

      // Fill in wrong credentials
      await page.fill('input[id="username"]', 'wronguser')
      await page.fill('input[id="password"]', 'wrongpassword')

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for error response from API
      await page.waitForResponse(response =>
        response.url().includes('/auth/login/') && response.status() >= 400,
        { timeout: 10000 }
      )

      // Wait a moment for state update
      await page.waitForTimeout(1000)

      // Should show error message
      await expect(
        page.locator('div').filter({ hasText: /Login failed|No active account|Invalid|credentials/i }).first()
      ).toBeVisible({ timeout: 5000 })

      // Should stay on login page
      await expect(page).toHaveURL(/.*\/id\/login/)
    })

  })

  test.describe('Authenticated Dashboard', () => {

    test('should show personalized welcome message', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // Should show greeting with time of day
      await expect(
        page.locator('h1').filter({ hasText: /Good (morning|afternoon|evening)/i }).first()
      ).toBeVisible({ timeout: 10000 })

      // Should show "What would you like to work on today?"
      await expect(page.locator('text=What would you like to work on today?')).toBeVisible()
    })

    test('should show logout button', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // There should be a logout button (with LogOut icon)
      await expect(page.locator('button[title="Sign out"]')).toBeVisible({ timeout: 10000 })
    })

    test('should show theme toggle', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // Theme toggle should be present
      await expect(page.locator('button').filter({ has: page.locator('svg') }).first()).toBeVisible()
    })

    test('should redirect to /id/logout when clicking logout', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // Click logout button
      await page.locator('button[title="Sign out"]').click()

      // Should navigate to Shizuha ID logout
      await page.waitForURL(/.*\/id\/logout.*/, { timeout: 15000 })
    })

  })

  test.describe('Session Persistence', () => {

    test('should persist authentication across page reload', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // Verify we're authenticated (see dashboard)
      await expect(
        page.locator('h1').filter({ hasText: /Good (morning|afternoon|evening)/i }).first()
      ).toBeVisible({ timeout: 10000 })

      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Should still see dashboard (not landing page)
      await expect(
        page.locator('h1').filter({ hasText: /Good (morning|afternoon|evening)/i }).first()
      ).toBeVisible({ timeout: 10000 })

      // Should NOT see landing page content
      await expect(page.locator('text=One login. All your tools.')).not.toBeVisible()
    })

    test('should show landing page after logout and clearing state', async ({ authenticatedPage }) => {
      const page = authenticatedPage

      // Clear auth state (simulating logout)
      await clearAuthState(page)

      // Reload the page
      await page.reload()
      await page.waitForLoadState('networkidle', { timeout: 15000 })

      // Should now see landing page
      await expect(page.locator('h1').filter({ hasText: /One login|All your tools/i }).first()).toBeVisible({ timeout: 10000 })
    })

  })

  test.describe('API Authentication', () => {

    test('should authenticate via API fixture', async ({ authenticatedApi }) => {
      // Test that authenticatedApi fixture works - make a request to a protected endpoint
      const response = await authenticatedApi.get('me/')

      expect(response.ok()).toBeTruthy()
      const data = await response.json()
      expect(data).toBeDefined()
      expect(data.username).toBe(TEST_USER.username)
    })

  })

})
