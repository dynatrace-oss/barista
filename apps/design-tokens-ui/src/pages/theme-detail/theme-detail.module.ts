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

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtSelectModule } from '@dynatrace/barista-components/select';
import { DtCheckboxModule } from '@dynatrace/barista-components/checkbox';

import { DesignTokensUiInputModule } from '@dynatrace/design-tokens-ui/input';
import { PipesModule } from '../../pipes';
import { ThemeDetailComponent } from './theme-detail.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ThemePreviewComponent } from './components/theme-preview/theme-preview.component';
import { ThemeSettingsComponent } from './components/theme-settings/theme-settings.component';
import { PaletteSettingsComponent } from './components/palette-settings/palette-settings.component';
import { SharedGenerationSettingsComponent } from './components/shared-generation-settings/shared-generation-settings.component';
import { DistributionCurveComponent } from './components/distribution-curve/distribution-curve.component';
import { EasingSettingsComponent } from './components/easing-settings/easing-settings.component';
import { EasingTypeSelectComponent } from './components/easing-type-select/easing-type-select.component';
import { ThemeDetailGuard } from './theme-detail.guard';
import {
  ContrastValidateDirective,
  ExponentValidateDirective,
} from './validators';

const routes: Route[] = [
  {
    path: '',
    component: ThemeDetailComponent,
    canActivate: [ThemeDetailGuard],
    canDeactivate: [ThemeDetailGuard],
    children: [
      {
        path: ':palette',
        component: PaletteSettingsComponent,
      },
      {
        path: '',
        component: ThemeSettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DtIconModule,
    DtSelectModule,
    DtCheckboxModule,
    PipesModule,
    DesignTokensUiInputModule,
  ],
  declarations: [
    ThemeDetailComponent,
    ThemePreviewComponent,
    ColorPickerComponent,
    PaletteSettingsComponent,
    ThemeSettingsComponent,
    SharedGenerationSettingsComponent,
    DistributionCurveComponent,
    EasingSettingsComponent,
    EasingTypeSelectComponent,
    ContrastValidateDirective,
    ExponentValidateDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ThemeDetailModule {}
