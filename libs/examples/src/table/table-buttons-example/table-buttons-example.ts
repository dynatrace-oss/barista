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

@Component({
  selector: 'dt-example-table-buttons',
  templateUrl: './table-buttons-example.html',
})
export class DtExampleTableButtons {
  data: object[] = [
    {
      title: 'dev-BB: VerificationService',
      subtitle: 'dynatrace-dev-BB',
      requests: 45,
    },
    {
      title: 'dev-BB: BookingService',
      subtitle: 'dynatrace-dev-BB',
      requests: 10,
    },
    {
      title: 'dev-BB: easyTravel Business Backend',
      subtitle: 'dynatrace-dev-BB',
      requests: 19,
    },
    {
      title: 'dev: easyTravel Customer Frontend',
      subtitle: 'dynatrace-dev-CF',
      requests: 7,
    },
  ];
}
