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

import { BaPageLayoutType } from '@dynatrace/shared/design-system/interfaces';

const baseLayout = (content: string) => ({
  title: 'Some title',
  layout: BaPageLayoutType.Default,
  category: 'Test',
  description: 'Some Description',
  contributors: {},
  toc: true,
  content,
});

export const TOC_NO_H2 = baseLayout(
  '<h3 id="first-id">First Headline<ba-headline-link id="first-id"></ba-headline-link></h3>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>\n' +
    '<h3 id="second-id">Second Headline<ba-headline-link id="second-id"></ba-headline-link></h3>\n' +
    '<p>The quick, brown fox jumps over a lazy dog.</p>\n' +
    '<h3 id="third-id">Third Headline<ba-headline-link id="third-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n',
);

export const TOC_MULTIPLE_CHILDS = baseLayout(
  '<h2 id="first-id">First Headline<ba-headline-link id="first-id"></ba-headline-link></h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>\n' +
    '<h3 id="second-id">Second Headline<ba-headline-link id="second-id"></ba-headline-link></h3>\n' +
    '<p>The quick, brown fox jumps over a lazy dog.</p>\n' +
    '<h3 id="third-id">Third Headline<ba-headline-link id="third-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n',
);

export const TOC_WITH_H4 = baseLayout(
  '<h2 id="first-id">First Headline<ba-headline-link id="first-id"></ba-headline-link></h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>\n' +
    '<h4 id="second-id">Second Headline<ba-headline-link id="second-id"></ba-headline-link></h4>\n' +
    '<p>The quick, brown fox jumps over a lazy dog.</p>\n' +
    '<h3 id="third-id">Third Headline<ba-headline-link id="third-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n',
);

export const TOC_LARGE_AMOUNT = baseLayout(
  '<h2 id="first-id">First Headline<ba-headline-link id="first-id"></ba-headline-link></h2>\n' +
    '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>\n' +
    '<h3 id="second-id">Second Headline<ba-headline-link id="second-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n' +
    '<h4 id="third-id">Third Headline<ba-headline-link id="third-id"></ba-headline-link></h4>\n' +
    '<p>The quick, brown fox jumps over a lazy dog.</p>\n' +
    '<h3 id="fourth-id">Fourth Headline<ba-headline-link id="fourth-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n' +
    '<h2 id="fifth-id">Fifth Headline<ba-headline-link id="fifth-id"></ba-headline-link></h2>\n' +
    '<p>The European languages are members of the same family.</p>\n' +
    '<h3 id="sixth-id">Sixth Headline<ba-headline-link id="sixth-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n' +
    '<h3 id="seventh-id">Seventh Headline<ba-headline-link id="seventh-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n' +
    '<h3 id="eight-id">Eight Headline<ba-headline-link id="eight-id"></ba-headline-link></h3>\n' +
    '<p>The European languages are members of the same family.</p>\n',
);
