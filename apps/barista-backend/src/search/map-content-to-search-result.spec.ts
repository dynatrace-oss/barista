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

import {
  replaceHtmlInContent,
  extractBodyMatches,
} from './map-content-to-search-result';
import {
  BaPageLayoutType,
  BaSinglePageContent,
} from '@dynatrace/barista-components/barista-definitions';
import { Index, MatchData } from 'lunr';

describe('Map content to search results', () => {
  describe('HTML replacer', () => {
    it('should replace <p> tags in contents', () => {
      const content =
        '<p>This is some test content that contains paragraph tags, that should be replaced.</p>';
      expect(replaceHtmlInContent(content)).toBe(
        'This is some test content that contains paragraph tags, that should be replaced.',
      );
    });

    it('should replace any html tags not in code blocks', () => {
      const content =
        '<p>This is some test <code><a>Example link code block</a></code> that should not be replaced.</p>';
      expect(replaceHtmlInContent(content)).toBe(
        'This is some test <a>Example link code block</a> that should not be replaced.',
      );
    });

    it('should replace html entities', () => {
      const content =
        '<p>This is some test content with html entities in it &lt;&gt;&amp;&apos;&quot;.</p>';
      expect(replaceHtmlInContent(content)).toBe(
        'This is some test content with html entities in it <>&\'".',
      );
    });

    it('should recreate the content length it had when indexing the content', () => {
      // tslint:disable-next-line max-len
      const content =
        '<p>The <code>&lt;dt-select&gt;</code> is like the native <code>&lt;select&gt;</code> a form control for selecting a\nvalue from a list of options. It is also designed to work with Angular forms. By\nusing the <code>&lt;dt-option&gt;</code> element, which is also provided in the select module,\nyou can add values to the select.</p>\n<ba-live-example name="DtExampleSelectDefault" templateSource="&lt;dt-select placeholder=&quot;Choose your coffee&quot; aria-label=&quot;Choose your coffee&quot;&gt;\n  &lt;dt-option value=&quot;ThePerfectPour&quot;&gt;ThePerfectPour&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Affogato&quot;&gt;Affogato&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Americano&quot;&gt;Americano&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Bicerin&quot;&gt;Bicerin&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Breve&quot;&gt;Breve&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caf&#xE9; Bomb&#xF3;n&quot;&gt;Caf&#xE9; Bomb&#xF3;n&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caf&#xE9; au lait&quot;&gt;Caf&#xE9; au lait&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caff&#xE9; Corretto&quot;&gt;Caff&#xE9; Corretto&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caf&#xE9; Crema&quot;&gt;Caf&#xE9; Crema&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caff&#xE9; Latte&quot;&gt;Caff&#xE9; Latte&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caff&#xE9; macchiato&quot;&gt;Caff&#xE9; macchiato&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Caf&#xE9; m&#xE9;lange&quot;&gt;Caf&#xE9; m&#xE9;lange&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Coffee milk&quot;&gt;Coffee milk&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cafe mocha&quot;&gt;Cafe mocha&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Ca phe sua da&quot;&gt;Ca phe sua da&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Kopi susu&quot;&gt;Kopi susu&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cappuccino &quot;&gt;Cappuccino&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cappuccino-cups&quot;&gt;Cappuccino-cups&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cappuccino&quot;&gt;Cappuccino&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Carajillo&quot;&gt;Carajillo&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cortado&quot;&gt;Cortado&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Cuban espresso&quot;&gt;Cuban espresso&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Espresso&quot;&gt;Espresso&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;The Flat White&quot;&gt;The Flat White&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Frappuccino&quot;&gt;Frappuccino&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Galao&quot;&gt;Galao&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Greek frapp&#xE9; coffee&quot;&gt;Greek frapp&#xE9; coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Iced Coffee&quot;&gt;Iced Coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Indian filter coffee&quot;&gt;Indian filter coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Instant coffee&quot;&gt;Instant coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Irish coffee&quot;&gt;Irish coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Kopi Luwak&quot;&gt;Kopi Luwak&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Kopi Tubruk&quot;&gt;Kopi Tubruk&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Turkish coffee&quot;&gt;Turkish coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Vienna coffee&quot;&gt;Vienna coffee&lt;/dt-option&gt;\n  &lt;dt-option value=&quot;Yuanyang&quot;&gt;Yuanyang&lt;/dt-option&gt;\n&lt;/dt-select&gt;\n" classSource="@Component({ ... })\nexport class DtExampleSelectDefault {}"></ba-live-example>\n';
      const originalContent = `The <dt-select> is like the native <select> a form control for selecting a
value from a list of options. It is also designed to work with Angular forms. By
using the <dt-option> element, which is also provided in the select module,
you can add values to the select.
`;
      expect(replaceHtmlInContent(content)).toBe(originalContent);
    });
  });

  describe('Content match extractor', () => {
    const iconContentFixture: BaSinglePageContent = {
      title: 'Airplane',
      layout: BaPageLayoutType.Icon,
      tags: ['flight', 'wings'],
      content: '<ul><li>Added in version 1.0.1</li></ul>',
    };

    it('should leave contentMatches empty if there is no content match', () => {
      const queryResult: Index.Result = {
        ref: '/resources/icons/airplane/',
        score: 56,
        matchData: {
          metadata: {
            nonMatchToken: {},
          },
        } as MatchData,
      };
      expect(extractBodyMatches(iconContentFixture, queryResult)).toEqual([]);
    });

    it('should list a contentMatch if there is one.', () => {
      const queryResult: Index.Result = {
        ref: '/resources/icons/airplane/',
        score: 56,
        matchData: {
          metadata: {
            version: {
              body: {
                position: [[10, 17]],
              },
            },
          },
        } as MatchData,
      };
      expect(extractBodyMatches(iconContentFixture, queryResult)).toEqual([
        'Added in version 1.0.1',
      ]);
    });
  });
});
