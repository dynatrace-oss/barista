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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DtStepper } from '@dynatrace/barista-components/stepper';

@Component({
  selector: 'dt-example-stepper-default',
  templateUrl: './stepper-default-example.html',
  styles: [
    `
      .monitor-type-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        max-width: 800px;
      }
      .monitor-type {
        display: grid;
        grid-template-rows: auto auto 1fr auto;
      }
      .monitor-type img {
        justify-self: center;
      }
    `,
  ],
})
export class DtExampleStepperDefault implements OnInit {
  @ViewChild(DtStepper, { static: true }) stepper: DtStepper;

  configurationFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.configurationFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: no-unbound-method
      nameCtrl: ['', Validators.required],
    });
  }
}
