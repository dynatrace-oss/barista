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

it('should create declarations and exports in the decorator', () => {
  const source = createSourceFile(
    'dummy.ts',
    `
import { DtExampleChartAreaRange } from './chart-arearange-example/chart-arearange-example';
import { DtExampleChartBar } from './chart-bar-example/chart-bar-example';
import { DtExampleChartBehaviorSwitch } from './chart-behavior-switch-example/chart-behavior-switch-example';
import { DtExampleChartCategorized } from './chart-categorized-example/chart-categorized-example';
import { DtExampleChartDefault } from './chart-default-example/chart-default-example';
import { DtExampleChartDonut } from './chart-donut-example/chart-donut-example';
import { DtChartExampleDataService } from './chart-example-data.service';
import { DtExampleChartHeatfield } from './chart-heatfield-example/chart-heatfield-example';
import { DtExampleChartHeatfieldMultiple } from './chart-heatfield-multiple-example/chart-heatfield-multiple-example';
import { DtExampleChartLine } from './chart-line-example/chart-line-example';
import { DtExampleChartLineWithGaps } from './chart-line-with-gaps-example/chart-line-with-gaps-example';
import { DtExampleChartLoading } from './chart-loading-example/chart-loading-example';
import { DtExampleChartMinMax } from './chart-min-max-example/chart-min-max-example';
import { DtExampleChartOrderedColors } from './chart-ordered-colors-example/chart-ordered-colors-example';
import { DtExampleChartPie } from './chart-pie-example/chart-pie-example';
import { DtExampleChartSelectionAreaDefault } from './chart-selection-area-default-example/chart-selection-area-default-example';
import { DtExampleChartSinglePointData } from './chart-single-data-point-example/chart-single-data-point-example';
import { DtExampleChartStream } from './chart-stream-example/chart-stream-example';

@NgModule({
  imports: [
    CommonModule,
    DtChartModule,
    DtKeyValueListModule,
    DtButtonModule,
    DtButtonGroupModule,
  ],
  declarations: [
    DtExampleChartArea,
    DtExampleChartAreaRange,
    DtExampleChartBar,
    DtExampleChartBehaviorSwitch,
    DtExampleChartCategorized,
    DtExampleChartDefault,
    DtExampleChartDonut,
    DtExampleChartHeatfield,
    DtExampleChartHeatfieldMultiple,
    DtExampleChartLine,
    DtExampleChartLineWithGaps,
    DtExampleChartLoading,
    DtExampleChartMinMax,
    DtExampleChartOrderedColors,
    DtExampleChartPie,
    DtExampleChartSelectionAreaDefault,
    DtExampleChartSinglePointData,
    DtExampleChartStream,
  ],
  providers: [DtChartExampleDataService],
})
export class DtChartExamplesModule {}
    `,
    ScriptTarget.Latest,
    true, // setParentNodes
    ScriptKind.TS,
  );
  expect(
    transformFile(
      source,
      'barista-components/src/chart-min-max-example/chart-min-max-example',
      'DtExampleChartMinMax',
    ),
  ).toMatchSnapshot();
});
