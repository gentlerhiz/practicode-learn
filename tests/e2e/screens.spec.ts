import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Every canvas screen, rendered with sample data at /fixtures/screens (src/app/(dev)/fixtures/screens).
// The real routes show the same views with real data, so this checks each view in every state it has.
const SCREENS = [
  'dashboard',
  'projects',
  'project',
  'review',
  'certificate',
  'community',
  'module-check',
  'module-result',
  'checkout',
  'bank-transfer',
  'paid',
  'pay-failed',
  'lesson-done',
  'lesson-done?learner',
  'loading',
]

for (const screen of SCREENS) {
  test(`the ${screen} screen has no accessibility violations in either theme`, async ({ page }) => {
    for (const scheme of ['dark', 'light'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(`/fixtures/screens/${screen}`)
      await expect(page.locator('#main')).toBeVisible()
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, `${screen} in ${scheme}`).toEqual([])
    }
  })
}
