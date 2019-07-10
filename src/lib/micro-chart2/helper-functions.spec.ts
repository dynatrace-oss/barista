import {
  calculateLabelPosition,
  interpolateNullValues,
} from './helper-functions';

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

  describe('interpolateNullValues', () => {
    let data;
    beforeEach(() => {
      data = [
        { x: 1, y: 10 },
        { x: 2, y: 50 },
        { x: 3, y: 80 },
        { x: 4, y: 60 },
        { x: 5, y: 40 },
      ];
    });
    it('should interpolate a single null value', () => {
      data[2].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 10 },
        { x: 2, y: 50 },
        { x: 3, y: 55, interpolated: true },
        { x: 4, y: 60 },
        { x: 5, y: 40 },
      ]);
    });

    it('should interpolate a single value at the start', () => {
      data[0].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 50, interpolated: true },
        { x: 2, y: 50 },
        { x: 3, y: 80 },
        { x: 4, y: 60 },
        { x: 5, y: 40 },
      ]);
    });

    it('should interpolate a single value at the end', () => {
      data[4].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 10 },
        { x: 2, y: 50 },
        { x: 3, y: 80 },
        { x: 4, y: 60 },
        { x: 5, y: 60, interpolated: true },
      ]);
    });

    it('should interpolate a multiple values in the middle', () => {
      data[1].y = null;
      data[2].y = null;
      data[3].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 10 },
        { x: 2, y: 17.5, interpolated: true },
        { x: 3, y: 25, interpolated: true },
        { x: 4, y: 32.5, interpolated: true },
        { x: 5, y: 40 },
      ]);
    });

    it('should interpolate a multiple values at the start', () => {
      data[0].y = null;
      data[1].y = null;
      data[2].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 60, interpolated: true },
        { x: 2, y: 60, interpolated: true },
        { x: 3, y: 60, interpolated: true },
        { x: 4, y: 60 },
        { x: 5, y: 40 },
      ]);
    });

    it('should interpolate a multiple values at the end', () => {
      data[2].y = null;
      data[3].y = null;
      data[4].y = null;
      const interpolated = interpolateNullValues(data);
      expect(interpolated).toEqual([
        { x: 1, y: 10 },
        { x: 2, y: 50 },
        { x: 3, y: 50, interpolated: true },
        { x: 4, y: 50, interpolated: true },
        { x: 5, y: 50, interpolated: true },
      ]);
    });
  });
});
