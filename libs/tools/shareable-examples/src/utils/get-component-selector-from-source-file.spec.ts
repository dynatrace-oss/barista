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

import { getComponentSelectorFromSourceFile } from './get-component-selector-from-source-file';
import { createSourceFile, ScriptTarget, ScriptKind } from 'typescript';

it('should get the correct selector from the decorated class', async () => {
  const source = createSourceFile(
    'dummy.ts',
    `
    @Component({
      selector: 'dummy-component',
    })
    export class DtDummyExample{}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );

  const classname = await getComponentSelectorFromSourceFile(source);
  expect(classname).toBe('dummy-component');
});

it('should get the correct selector when multiple classes are defined', async () => {
  const source = createSourceFile(
    'dummy.ts',
    `
    export class NotWantedClass {}

    @Component({
      selector: 'dummy-component',
    })
    export class DtDummyExample{}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );

  const classname = await getComponentSelectorFromSourceFile(source);
  expect(classname).toBe('dummy-component');
});

it('should get the firest selector when multiple selectors are defined', async () => {
  const source = createSourceFile(
    'dummy.ts',
    `
    @Component({
      selector: 'dummy-component',
      selector: 'invalid-second-selector'
    })
    export class DtDummyExample{}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );

  const classname = await getComponentSelectorFromSourceFile(source);
  expect(classname).toBe('dummy-component');
});
