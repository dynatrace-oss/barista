/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
