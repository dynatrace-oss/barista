/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { BaPageLayoutType } from '@dynatrace/barista-definitions';
import {
  componentTagsTransformer,
  extractH1ToTitleTransformer,
  internalLinksTransformerFactory,
  headingIdTransformer,
} from './transform';

describe('Barista transformers', () => {
  const testpage = {
    title: 'Testpage',
    layout: BaPageLayoutType.Default,
    content: '',
  };

  describe('componentTagsTransformer', () => {
    it('should set component tags if no tags are available', async () => {
      expect(await componentTagsTransformer(testpage)).toEqual({
        title: 'Testpage',
        layout: BaPageLayoutType.Default,
        content: '',
        tags: ['component', 'angular'],
      });
    });

    it('should add component tags if there are already tags set', async () => {
      expect(
        await componentTagsTransformer({ ...testpage, tags: ['foo'] }),
      ).toEqual({
        title: 'Testpage',
        layout: BaPageLayoutType.Default,
        content: '',
        tags: ['component', 'angular', 'foo'],
      });
    });
  });

  describe('extractH1ToTitleTransformer', () => {
    it('should remove all h1 tags in the content', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const expectedContent = ` foo \n<strong>bar</strong>  dolor.`;
      const transformed = await extractH1ToTitleTransformer({
        ...testpage,
        content,
      });
      expect(transformed.content).toBe(expectedContent);
    });

    it('should not override the title if it`s already set', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const transformed = await extractH1ToTitleTransformer({
        ...testpage,
        title: 'foo',
        content,
      });
      expect(transformed.title).toBe('foo');
    });

    it('should override the title if it`s not set', async () => {
      const content = `<h1>Test</h1> foo \n<strong>bar</strong> <h1>lorem <i>ipsum</i></h1> dolor.`;
      const transformed = await extractH1ToTitleTransformer({
        title: '',
        layout: BaPageLayoutType.Default,
        content,
      });
      expect(transformed.title).toBe('Test');
    });
  });

  describe('internalLinksTransformer', () => {
    it('should not remove the href url if the link and the build are internal', async () => {
      const internalLinksTransformer = internalLinksTransformerFactory(false, [
        'dynatrace.com',
      ]);
      const content = `foo <a href="https://www.dynatrace.com/news">Secret link</a> bar`;
      const transformed = await internalLinksTransformer({
        title: '',
        layout: BaPageLayoutType.Default,
        content,
      });
      expect(transformed.content).toBe(content);
    });

    it('should remove the href url if the link is internal but the build is public', async () => {
      const internalLinksTransformer = internalLinksTransformerFactory(true, [
        'dynatrace.com',
      ]);
      const content = `foo <a href="https://www.dynatrace.com/news">Secret link</a> bar`;
      const transformed = await internalLinksTransformer({
        title: '',
        layout: BaPageLayoutType.Default,
        content,
      });
      expect(transformed.content).toBe(
        `foo <a href="#" class="ba-internal-url">Secret link</a> bar`,
      );
    });
  });

  describe('headingIdTransformer', () => {
    it('should remove unwanted characters from title and add ID to headline', async () => {
      const content =
        "<h2>What's new?</h2><h3>Coffee & tea</h3><h3>Awesome!</h3>";
      const transformed = await headingIdTransformer({
        title: '',
        layout: BaPageLayoutType.Default,
        content,
      });
      expect(transformed.content).toBe(
        '<h2 id="what-s-new">What&apos;s new?</h2>' +
          '<h3 id="coffee-tea">Coffee &amp; tea</h3>' +
          '<h3 id="awesome">Awesome!</h3>',
      );
    });

    it('should add a letter as first character if the headline starts with a number', async () => {
      const content = '<h2>1. Definitions.</h2>';
      const transformed = await headingIdTransformer({
        title: '',
        layout: BaPageLayoutType.Default,
        content,
      });
      expect(transformed.content).toBe(
        '<h2 id="h1-definitions">1. Definitions.</h2>',
      );
    });
  });
});
