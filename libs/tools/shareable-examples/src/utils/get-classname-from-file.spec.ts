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

import { getClassnameFromSourceFile } from './get-classname-from-source-file';
import { createSourceFile, ScriptTarget, ScriptKind } from 'typescript';

it('should get the classname from a Component class', () => {
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

  const classname = getClassnameFromSourceFile(source);
  expect(classname).toBe('DtDummyExample');
});

it('should get the classname from a Module class', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
    @NgModule({
    })
    export class DtDummyExampleModule{}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );

  const classname = getClassnameFromSourceFile(source);
  expect(classname).toBe('DtDummyExampleModule');
});

it('should get the last class if there are multiple classes in the file', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
    @Component({
      selector: 'dummy-component',
    })
    export class DtDummyExample{}
();
    @NgModule({
    })
    export class DtDummyExampleModule{}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  const classname = getClassnameFromSourceFile(source);
  expect(classname).toBe('DtDummyExampleModule');
});
