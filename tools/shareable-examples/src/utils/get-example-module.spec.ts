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

import { createTransformer } from './get-example-module';
import {
  createSourceFile,
  ScriptTarget,
  ScriptKind,
  SourceFile,
  transform,
  createPrinter,
} from 'typescript';

function transformFile(
  moduleSource: SourceFile,
  exampleRoot: string,
  exampleClassName: string,
): string {
  const result = transform(moduleSource, [
    createTransformer(exampleRoot, exampleClassName),
  ]);

  // To apply the changes the transformed file needs to be passed
  // to a printer to get the updated file.
  const printer = createPrinter();
  return printer.printFile(result.transformed[0]);
}

it('should remove all relative imports, which are not related to the current example', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
import { NgModule } from '@angular/core';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTileModule } from '@dynatrace/barista-components/tile';

import { DtExampleOverlayComplexContent } from './overlay-complex-content-example/overlay-complex-content-example';
import { DtExampleOverlayDefault } from './overlay-default-example/overlay-default-example';
import { DtExampleOverlayImplicitContext } from './overlay-implicit-context-example/overlay-implicit-context-example';

    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  expect(
    transformFile(
      source,
      'barista-components/src/overlay-default-example/overlay-default-example',
      'DtExampleOverlayDefault',
    ),
  ).toMatchSnapshot();
});

it('should remove all relative imports, which are not related to the current example', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
import { NgModule } from '@angular/core';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { DtKeyValueListModule } from '@dynatrace/barista-components/key-value-list';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTileModule } from '@dynatrace/barista-components/tile';

import { SomeService } from './example.service.ts';
import { DtExampleOverlayComplexContent } from './overlay-complex-content-example/overlay-complex-content-example';
import { DtExampleOverlayDefault } from './overlay-default-example/overlay-default-example';
import { DtExampleOverlayImplicitContext } from './overlay-implicit-context-example/overlay-implicit-context-example';
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  expect(
    transformFile(
      source,
      'barista-components/src/overlay-default-example/overlay-default-example',
      'DtExampleOverlayDefault',
    ),
  ).toMatchSnapshot();
});

it('should remove the examples array in the module file', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
export const shouldStayArray = ['hello'];

export const DT_OVERLAY_EXAMPLES = [
  DtExampleOverlayComplexContent,
  DtExampleOverlayDefault,
  DtExampleOverlayImplicitContext,
  DtExampleOverlayProgrammatic,
  DtExampleOverlayTile,
];
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  expect(
    transformFile(
      source,
      'barista-components/src/overlay-default-example/overlay-default-example',
      'DtExampleOverlayDefault',
    ),
  ).toMatchSnapshot();
});

it('should replace declarations and entryComponents in the module decorator', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
@NgModule({
  imports: [
    DtOverlayModule,
    DtButtonModule,
    DtTileModule,
    DtKeyValueListModule,
    DtIconModule,
  ],
  declarations: [...DT_OVERLAY_EXAMPLES, DtExampleOverlayProgrammaticDummy],
  entryComponents: [...DT_OVERLAY_EXAMPLES, DtExampleOverlayProgrammaticDummy],
})
export class DtOverlayExamplesModule {}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  expect(
    transformFile(
      source,
      'barista-components/src/overlay-default-example/overlay-default-example',
      'DtExampleOverlayDefault',
    ),
  ).toMatchSnapshot();
});
