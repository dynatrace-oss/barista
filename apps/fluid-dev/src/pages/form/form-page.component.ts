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
// tslint:disable-next-line: no-duplicate-imports
import '@dynatrace/fluid-elements/fluid-form';
import '@dynatrace/fluid-elements/checkbox';
import '@dynatrace/fluid-elements/switch';
// tslint:disable-next-line: no-duplicate-imports
import { FluidFormSubmitEvent } from '@dynatrace/fluid-elements/fluid-form';

@Component({
  selector: 'fluid-form-page',
  templateUrl: 'form-page.component.html',
  styleUrls: ['form-page.component.scss'],
})
export class FluidFormPage {
  handleSubmit(e: FluidFormSubmitEvent): void {
    alert(JSON.stringify(Array.from(e.formData.entries())));
  }
}
