import { browser, by, element } from 'protractor';

describe('ProgressBar', () => {
  beforeEach(async () => browser.get('/progress-bar'));

  it('should have classes', async () => {
    expect(await element(by.id('progressbar')).getAttribute('class')).toContain(
      'dt-progress-bar',
    );
  });

  it('should have aria attributes', async () => {
    expect(
      await element(by.id('progressbar')).getAttribute('aria-valuenow'),
    ).toContain('30');
    expect(
      await element(by.id('progressbar')).getAttribute('aria-valuemin'),
    ).toContain('0');
  });
});
