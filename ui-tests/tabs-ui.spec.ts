import { browser, element, by } from 'protractor';

describe('Tabs', () => {
  beforeEach(async () => browser.get('/tabs'));

  it('should execute click handlers when not disabled', async () => {
    await element(by.id('packets')).click();
    const packetsTab = element(by.id('dt-tab-group-1-content-packets'));
    const qualityTab = element(by.id('dt-tab-group-1-content-quality'));
    expect(await packetsTab.getText()).toEqual('Packets');
    expect(await packetsTab.getAttribute('class')).toContain('dt-tab-body-active');
    await element(by.id('quality')).click();
    expect(await qualityTab.getText()).toEqual('Quality');
    expect(await qualityTab.getAttribute('class')).toContain('dt-tab-body-active');
    expect(await packetsTab.getAttribute('class')).not.toContain('dt-tab-body-active');
  });
  it('should not execute click handlers when item disabled', async () => {
    await element(by.id('traffic')).click();
    const packetsTab = element(by.id('dt-tab-group-1-content-packets'));
    const trafficTab = element(by.id('dt-tab-group-1-content-traffic'));
    expect(await packetsTab.getText()).toEqual('Packets');
    expect(await packetsTab.getAttribute('class')).toContain('dt-tab-body-active');
    expect(await trafficTab.getAttribute('class')).not.toContain('dt-tab-body-active');
  });
});
