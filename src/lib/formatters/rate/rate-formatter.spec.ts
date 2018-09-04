import { DtRateUnit } from '../unit';
import { getFactorToMs, convertRates } from './rate-formatter';

fdescribe('rateFormatter', () => {
  describe('getFactorToMs', () => {
    it('should return the correct factor for ms', () => {
      expect(getFactorToMs(DtRateUnit.PER_MILLISECOND)).toEqual(1);
    });
    it('should return the correct factor for s', () => {
      expect(getFactorToMs(DtRateUnit.PER_SECOND)).toEqual(1000);
    });
    it('should return the correct factor for min', () => {
      expect(getFactorToMs(DtRateUnit.PER_MINUTE)).toEqual(1000 * 60);
    });
    it('should return the correct factor for hour', () => {
      expect(getFactorToMs(DtRateUnit.PER_HOUR)).toEqual(1000 * 60 * 60);
    });
    it('should return the correct factor for day', () => {
      expect(getFactorToMs(DtRateUnit.PER_DAY)).toEqual(1000 * 60 * 60 * 24);
    });
    it('should return the correct factor for week', () => {
      expect(getFactorToMs(DtRateUnit.PER_WEEK)).toEqual(1000 * 60 * 60 * 24 * 7);
    });
    it('should return the correct factor for month', () => {
      expect(getFactorToMs(DtRateUnit.PER_MONTH)).toEqual(1000 * 60 * 60 * 24 * 7 * 30);
    });
    it('should return the correct factor for year', () => {
      expect(getFactorToMs(DtRateUnit.PER_YEAR)).toEqual(1000 * 60 * 60 * 24 * 7 * 30 * 12);
    });
  });

  describe('convertRates', () => {
    it('should convert from s to ms', () => {
      expect(convertRates(60, DtRateUnit.PER_SECOND, DtRateUnit.PER_MILLISECOND)).toEqual(0.06);
    });
    it('should convert from ms to s', () => {
      expect(convertRates(60, DtRateUnit.PER_MILLISECOND, DtRateUnit.PER_SECOND)).toEqual(60000);
    });
    it('should convert from s to days', () => {
      expect(convertRates(1, DtRateUnit.PER_SECOND, DtRateUnit.PER_DAY)).toEqual(60 * 60 * 24);
    });
    it('should convert from days to s', () => {
      expect(convertRates(24 * 60 * 60 * 100, DtRateUnit.PER_DAY, DtRateUnit.PER_SECOND)).toEqual(100);
    });
    it('should convert from days to week', () => {
      expect(convertRates(2, DtRateUnit.PER_DAY, DtRateUnit.PER_WEEK)).toEqual(14);
    });
  });
});
