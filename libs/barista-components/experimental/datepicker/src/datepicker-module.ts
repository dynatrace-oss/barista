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

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';
import { DtCalendar } from './calendar';
import { DtCalendarBody } from './calendar-body';
import { DtDatePicker } from './datepicker';
import { DtTimeInput } from './timeinput';
import { DtTimepicker } from './timepicker';

const COMPONENTS = [
  DtDatePicker,
  DtCalendar,
  DtCalendarBody,
  DtTimepicker,
  DtTimeInput,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    DtButtonModule,
    DtIconModule,
    DtInputModule,
    A11yModule,
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
})
export class DtDatepickerModule {}
