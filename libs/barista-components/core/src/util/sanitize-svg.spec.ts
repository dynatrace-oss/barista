/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers */
/*eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector */

import { sanitizeSvg } from './sanitize-svg';

describe('sanitizeSvg', () => {
  it('should remove script tag inside svg strings', () => {
    expect(sanitizeSvg('<svg><script>alert(1)</script></svg>').outerHTML).toBe(
      '<svg></svg>',
    );
  });
  it('should remove script tag with type inside svg strings', () => {
    expect(
      sanitizeSvg('<svg><script type="text/javascript">alert(1)</script></svg>')
        .outerHTML,
    ).toBe('<svg></svg>');
  });
  it('should remove nested script tags inside svg strings', () => {
    expect(
      sanitizeSvg(
        '<svg><script>alert(1)<script>alert(1)</script></script></svg>',
      ).outerHTML,
    ).toBe('<svg></svg>');
  });
  it('should remove multiple script tag inside svg strings', () => {
    expect(
      sanitizeSvg(
        '<svg><script>alert(1)</script><script>alert(1)</script></svg>',
      ).outerHTML,
    ).toBe('<svg></svg>');
  });
  it('should throw an error if no svg tag is found', () => {
    expect(() => sanitizeSvg('<div></div>')).toThrow(
      new Error('<svg> tag not found'),
    );
    expect(() => sanitizeSvg('')).toThrow(new Error('<svg> tag not found'));
  });
});
