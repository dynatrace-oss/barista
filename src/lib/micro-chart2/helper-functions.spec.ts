import { calculateLabelPosition } from './helper-functions';

describe('DtMicroChart - Helper functions', () => {

  describe('calculateLabelPosition', () => {
    it('should be middle if the label fits', () => {
      expect(calculateLabelPosition(150, 100, 300)).toBe('middle');
    });

    it('should be start if middle would cut the label', () => {
      expect(calculateLabelPosition(25, 100, 300)).toBe('start');
    });

    it('should be end if left would cut the label', () => {
      expect(calculateLabelPosition(275, 100, 300)).toBe('end');
    });

    it('should be middle if all other options would cut the label', () => {
      expect(calculateLabelPosition(150, 400, 300)).toBe('middle');
    });
  });
});
