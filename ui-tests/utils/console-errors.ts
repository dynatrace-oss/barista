import { browser, logging } from 'protractor';

const MIN_ERROR_LOG_LEVEL = 900;

export async function getConsoleErrors(): Promise<logging.Entry[]> {
  try {
    const errors = await browser.manage().logs().get('browser');
    // only get Errors no Warnings!
    return errors.filter((error) => error.level.value > MIN_ERROR_LOG_LEVEL);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(error);
    return [];
  }
}
