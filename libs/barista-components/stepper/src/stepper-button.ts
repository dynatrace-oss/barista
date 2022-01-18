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

import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  selector: 'button[dt-button][dtStepperNext]',
  exportAs: 'dtStepperNext',
  host: {
    class: 'dt-stepper-next',
  },
})
export class DtStepperNext extends CdkStepperNext {}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  selector: 'button[dt-button][dtStepperPrevious]',
  exportAs: 'dtStepperPrevious',
  host: {
    class: 'dt-stepper-previous',
  },
})
export class DtStepperPrevious extends CdkStepperPrevious {}
