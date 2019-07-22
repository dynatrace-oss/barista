// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { DtDateRange } from './date-range';

describe('DtDateRange', () => {
  let pipe: DtDateRange;

  beforeEach(() => {
    pipe = new DtDateRange('en-US');
    jasmine.clock().mockDate(new Date('2019/06/01 09:33:21'));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('Transforming date range with default en-US locale', () => {
    it('should transform an empty array to an empty string', () => {
      expect(pipe.transform([] as any).toString()).toEqual('');
    });

    it('should transform to long or short arrays to an empty string', () => {
      expect(pipe.transform([1] as any).toString()).toEqual('');
      expect(pipe.transform([1, 2, 3] as any).toString()).toEqual('');
    });

    it('should format two dates on the same day without a second day', () => {
      const start = new Date('2019/02/11 08:20:11').getTime();
      const end = new Date('2019/02/11 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        'Feb 11 08:20 — 10:20',
      );
    });

    it('should format two dates on the same year without a second year', () => {
      const start = new Date('2019/02/11 08:20:11').getTime();
      const end = new Date('2019/02/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        'Feb 11 08:20 — Feb 12 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2018/12/11 08:20:11').getTime();
      const end = new Date('2018/12/11 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2018 Dec 11 08:20 — 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2018/12/11 08:20:11').getTime();
      const end = new Date('2018/12/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2018 Dec 11 08:20 — Dec 12 10:20',
      );
    });

    it('should format two dates on the same day in a different year with a leading year', () => {
      const start = new Date('2017/02/11 08:20:11').getTime();
      const end = new Date('2018/12/12 10:20:11').getTime();

      expect(pipe.transform([start, end]).toString()).toEqual(
        '2017 Feb 11 08:20 — 2018 Dec 12 10:20',
      );
    });
  });
});
