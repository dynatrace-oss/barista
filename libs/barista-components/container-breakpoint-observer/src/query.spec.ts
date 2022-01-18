/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { QUERY_INVALID_TOKEN, convertQuery } from './query';

describe('Query', () => {
  describe('convertQuery', () => {
    afterEach(() => {
      window.matchMedia = undefined as any;
    });

    it('should return an element query if its a valid and supported query string (min-width)', () => {
      window.matchMedia = () => ({ media: '(min-width: 300px)' } as any);

      expect(convertQuery('(min-width: 300px)')).toMatchObject({
        range: 'min',
        feature: 'width',
        value: '300px',
      });
    });

    it('should return an element query if its a valid and supported query string (max-width)', () => {
      window.matchMedia = () => ({ media: '(max-width: 300px)' } as any);

      expect(convertQuery('(max-width: 300px)')).toMatchObject({
        range: 'max',
        feature: 'width',
        value: '300px',
      });
    });

    it('should return an element query if its a valid and supported query string (min-height)', () => {
      window.matchMedia = () => ({ media: '(min-height: 300px)' } as any);

      expect(convertQuery('(min-height: 300px)')).toMatchObject({
        range: 'min',
        feature: 'height',
        value: '300px',
      });
    });

    it('should return an element query if its a valid and supported query string (max-height)', () => {
      window.matchMedia = () => ({ media: '(max-height: 300px)' } as any);

      expect(convertQuery('(max-height: 300px)')).toMatchObject({
        range: 'max',
        feature: 'height',
        value: '300px',
      });
    });

    it('should return null if its a valid and but not supported query string (hover)', () => {
      window.matchMedia = () => ({ media: '(hover: hover)' } as any);

      expect(convertQuery('(hover: hover)')).toBe(QUERY_INVALID_TOKEN);
    });

    it('should return null if its a valid and but not supported query string (all)', () => {
      window.matchMedia = () => ({ media: 'all' } as any);

      expect(convertQuery('all')).toBe(QUERY_INVALID_TOKEN);
    });

    it('should return null if its a invalid query string', () => {
      window.matchMedia = () => ({ media: 'foo' } as any);

      expect(convertQuery('foo')).toBe(QUERY_INVALID_TOKEN);
    });

    it('should return an element query if its a valid and supported but bad formatted query string', () => {
      window.matchMedia = () => ({ media: ' ( min-width: 300px ) ' } as any);

      expect(convertQuery('(min-width: 300px)')).toMatchObject({
        range: 'min',
        feature: 'width',
        value: '300px',
      });
    });

    it('should return an element query if its a valid query string but polluted with `all and`', () => {
      window.matchMedia = () =>
        ({ media: 'all and (min-width: 300px)' } as any);

      expect(convertQuery('(min-width: 300px)')).toMatchObject({
        range: 'min',
        feature: 'width',
        value: '300px',
      });
    });
  });
});
