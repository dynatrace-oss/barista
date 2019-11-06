import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
} from './transform';

describe('Barista transformers', () => {
  describe('componentTagsTransformer', () => {
    it('should set component tags if no tags are available', async () => {
      expect(await componentTagsTransformer({})).toEqual({
        tags: ['component', 'angular'],
      });
    });

    it('should add component tags if there are already tags set', async () => {
      expect(await componentTagsTransformer({ tags: ['foo'] })).toEqual({
        tags: ['component', 'angular', 'foo'],
      });
    });
  });

  describe('extractH1ToTitleTransformer', () => {
    it('should remove all h1 tags in the content', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const expectedContent = ` foo \n<strong>bar</strong>  dolor.`;
      const transformed = await extractH1ToTitleTransformer({ content });
      expect(transformed.content).toBe(expectedContent);
    });

    it('should not override the title if it`s already set', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const transformed = await extractH1ToTitleTransformer({
        title: 'foo',
        content,
      });
      expect(transformed.title).toBe('foo');
    });

    it('should override the title if it`s not set', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const transformed = await extractH1ToTitleTransformer({ content });
      expect(transformed.title).toBe('Test');
    });
  });
});
