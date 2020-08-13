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
import '@dynatrace/fluid-elements/button-group';

@Component({
  selector: 'fluid-button-page',
  templateUrl: 'button-group-page.component.html',
})
export class FluidButtonGroupPage {
  disable = false;
  disableall = false;
  show = true;

  logs: Event[] = [];

  handleChange(evt: Event): void {
    console.log(evt);
    this.logs.push(evt);
  }
}
