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
import { NgModule } from '@angular/core';
import { DtTileModule } from '@dynatrace/barista-components/tile';
import { DtExampleTileDefault } from './tile-default-example/tile-default-example';
import { DtExampleTileRecovered } from './tile-recovered-example/tile-recovered-example';
import { DtExampleTileSmall } from './tile-small-example/tile-small-example';
import { DtExampleTileDisabled } from './tile-disabled-example/tile-disabled-example';
import { DtExampleTileError } from './tile-error-example/tile-error-example';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtExampleTileMain } from './tile-main-example/tile-main-example';
import { DtExampleTileWarning } from './tile-warning-example/tile-warning-example';

@NgModule({
  imports: [DtTileModule, DtIconModule],
  declarations: [
    DtExampleTileDefault,
    DtExampleTileDisabled,
    DtExampleTileError,
    DtExampleTileMain,
    DtExampleTileWarning,
    DtExampleTileRecovered,
    DtExampleTileSmall,
  ],
})
export class DtExamplesTileModule {}
