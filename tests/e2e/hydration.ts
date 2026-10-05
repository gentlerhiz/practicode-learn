import { expect, type Locator } from '@playwright/test'

/**
 * Waits until React has hydrated an element (it attaches its fiber to the DOM node). A click on a
 * server-rendered button before then does nothing, which made tests flaky on a busy machine.
 */
export async function waitForHydration(locator: Locator) {
  await expect
    .poll(() => locator.evaluate((el) => Object.keys(el).some((key) => key.startsWith('__reactFiber'))))
    .toBe(true)
}
