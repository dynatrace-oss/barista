// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { sanitizeSvg } from './sanitize-svg';

describe('sanitizeSvg', () => {
  it('should remove script tag inside svg strings', () => {
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>').outerHTML).toBe(
      '<svg></svg>'
    );
  });
  it('should remove script tag with type inside svg strings', () => {
    expect(
      sanitizeSvg('<svg><script type="text/javascript">alert(1)</script></svg>')
        .outerHTML
    ).toBe('<svg></svg>');
  });
  it('should remove nested script tags inside svg strings', () => {
    expect(
      sanitizeSvg(
        '<svg><script>alert(1)<script>alert(1)</script></script></svg>'
      ).outerHTML
    ).toBe('<svg></svg>');
  });
  it('should remove multiple script tag inside svg strings', () => {
    expect(
      sanitizeSvg(
        '<svg><script>alert(1)</script><script>alert(1)</script></svg>'
      ).outerHTML
    ).toBe('<svg></svg>');
  });
  it('should throw an error if no svg tag is found', () => {
    expect(() => sanitizeSvg('<div></div>')).toThrow(
      new Error('<svg> tag not found')
    );
    expect(() => sanitizeSvg('')).toThrow(new Error('<svg> tag not found'));
  });
});
