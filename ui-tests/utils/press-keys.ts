import { browser } from 'protractor';

/** Presses a key in the browser */
export const pressKey = (...keys: string[]) =>
  browser
    .actions()
    .sendKeys(...keys)
    .perform();
