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
import { Component } from '@angular/core';
import '@dynatrace/fluid-elements/design-system-provider';
import '@dynatrace/fluid-elements/button';
import '@dynatrace/fluid-elements/checkbox';
// tslint:disable-next-line: no-duplicate-imports
import {
  FluidTheme,
  FluidLayoutDensity,
} from '@dynatrace/fluid-elements/design-system-provider';

@Component({
  selector: 'fluid-design-system-provider-page',
  templateUrl: 'design-system-provider-page.component.html',
  styleUrls: ['design-system-provider-page.component.scss'],
})
export class FluidDesignSystemProviderPage {
  _theme: FluidTheme = 'abyss';
  _layoutDensity: FluidLayoutDensity = 'default';
}
