import { expect, test } from '@playwright/test'

const LESSON = '/learn/samples/every-step'
const workerReady = () => navigator.serviceWorker.ready.then(() => true)

test('a lesson opened once reloads with no connection, and still plays', async ({ page, context }) => {
  await page.goto(LESSON)
  await page.evaluate(workerReady)
  await page.reload() // the worker now controls the page and caches it
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible()
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'Every step, once' })).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByText('Step 2 of 15')).toBeVisible()
  await context.setOffline(false)
})

test('a page never opened shows the offline page, with the lessons that do work', async ({
  page,
  context,
}) => {
  await page.goto(LESSON)
  await page.evaluate(workerReady)
  await page.reload()
  await context.setOffline(true)
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: 'You’re offline' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Every step, once' })).toHaveAttribute('href', LESSON)
  await context.setOffline(false)
})

test('signed-in and sign-in pages are never kept for offline use', async ({ page }) => {
  await page.goto('/login')
  await page.evaluate(workerReady)
  await page.reload()
  const cached = await page.evaluate(async () => {
    const names = await caches.keys()
    const urls: string[] = []
    for (const name of names)
      for (const req of await (await caches.open(name)).keys()) urls.push(new URL(req.url).pathname)
    return urls
  })
  expect(cached.filter((u) => /^\/(login|signup|verify|auth|home|settings|admin|api)(\/|$)/.test(u))).toEqual(
    [],
  )
})
