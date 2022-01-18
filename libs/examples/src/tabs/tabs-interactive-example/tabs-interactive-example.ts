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

import { Component } from '@angular/core';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'dt-example-tabs-interactive',
  templateUrl: './tabs-interactive-example.html',
})
export class DtExampleTabsInteractive {
  simulatedColor = 'main';
  simulationRunning = false;
  disableFirst = false;
  connectivity = '100%';

  simulateError(): void {
    this.simulatedColor = 'error';
    this.simulationRunning = true;
    this.connectivity = '30%';
    // eslint-disable-next-line no-magic-numbers
    timer(1000, 1000)
      // eslint-disable-next-line no-magic-numbers
      .pipe(take(2))
      .subscribe(
        () => {
          this.simulatedColor =
            this.simulatedColor === 'error' ? 'recovered' : 'main';
          this.connectivity = '80%';
        },
        () => {},
        () => {
          this.simulationRunning = false;
          this.connectivity = '100%';
        },
      );
  }
}
