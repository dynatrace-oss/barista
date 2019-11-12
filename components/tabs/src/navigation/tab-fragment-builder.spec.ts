import { DtTabsRouterFragmentBuilder } from './tab-fragment-builder';

describe('DtTabsRouterFragmentBuilder', () => {
  it('should return a comma separated string of ids', () => {
    const ids = new Set(['packets', 'cpu-usage']);
    expect(DtTabsRouterFragmentBuilder.build(ids)).toEqual('packets,cpu-usage');
  });

  it('should return an empty string if set of ids is empty', () => {
    const ids = new Set();
    expect(DtTabsRouterFragmentBuilder.build(ids)).toEqual('');
  });
});
