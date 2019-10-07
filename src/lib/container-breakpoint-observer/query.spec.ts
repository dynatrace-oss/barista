// tslint:disable: no-any

import { convertQuery } from './query';

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

      expect(convertQuery('(hover: hover)')).toBeNull();
    });

    it('should return null if its a valid and but not supported query string (all)', () => {
      window.matchMedia = () => ({ media: 'all' } as any);

      expect(convertQuery('all')).toBeNull();
    });

    it('should return null if its a invalid query string', () => {
      window.matchMedia = () => ({ media: 'foo' } as any);

      expect(convertQuery('foo')).toBeNull();
    });

    it('should return an element query if its a valid and supported but bad formatted query string', () => {
      window.matchMedia = () => ({ media: ' ( min-width: 300px ) ' } as any);

      expect(convertQuery('(min-width: 300px)')).toMatchObject({
        range: 'min',
        feature: 'width',
        value: '300px',
      });
    });
  });
});
