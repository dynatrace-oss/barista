// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { clampRange } from './clamp-range';

describe('DtChartRange clamp values', () => {
  const maxWidth = 500;
  const minWidth = 10;

  it('should not clamp range when the provided range is inside the min and max constraints', () => {
    const range = { left: 10, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 10, width: 100 });
  });

  it('should clamp the left value to 0 if it is below', () => {
    const range = { left: -20, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 100 });
  });

  it('should clamp the width if it exceeds the maxWidth', () => {
    const range = { left: 0, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });

  it('should clamp the width if it exceeds the maxWidth', () => {
    const range = { left: 100, width: 500 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 100, width: 400 });
  });

  it('should clamp the width if the width is below the minimum', () => {
    const range = { left: 100, width: 1 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 100, width: 10 });
  });

  it('should clamp the width if the left value is to large for the max width', () => {
    const range = { left: 500, width: 100 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 490, width: 10 });
  });

  it('should clamp the width if the left is 0 and the width is to big', () => {
    const range = { left: 0, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });

  it('should clamp the width and left when both does not meet the constraints', () => {
    const range = { left: -10, width: 600 };
    const clamped = clampRange(range, maxWidth, minWidth);

    expect(clamped).toMatchObject({ left: 0, width: 500 });
  });
});
