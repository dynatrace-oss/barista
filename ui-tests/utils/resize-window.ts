import { browser } from 'protractor';

/**
 * Resizes the browser window to a provided width and height
 * @param width The width of the window that it should resize to
 * @param height The height the window it should resize to
 */
export async function resizeWindow(
  width: number,
  height: number = 1000,
): Promise<void> {
  return browser.driver
    .manage()
    .window()
    .setSize(width, height);
}
