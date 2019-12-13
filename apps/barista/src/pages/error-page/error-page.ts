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
import { BaErrorPageContent } from '@dynatrace/barista-components/barista-definitions';
import { BaPage } from '../page-outlet';

@Component({
  selector: 'ba-error-page',
  templateUrl: 'error-page.html',
  styleUrls: ['error-page.scss'],
  host: {
    role: 'main',
  },
})
export class BaErrorPage implements BaPage {
  contents: BaErrorPageContent;
}
