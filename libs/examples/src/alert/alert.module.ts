/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { NgModule } from '@angular/core';
import { DtAlertModule } from '@dynatrace/barista-components/alert';
import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtExampleAlertDark } from './alert-dark-example/alert-dark-example';
import { DtExampleAlertDarkError } from './alert-dark-error-example/alert-dark-error-example';
import { DtExampleAlertInteractive } from './alert-interactive-example/alert-interactive-example';
import { DtExampleAlertError } from './alert-error-example/alert-error-example';
import { DtExampleAlertWarning } from './alert-warning-example/alert-warning-example';

export const DT_ALERT_EXAMPLES = [
  DtExampleAlertDark,
  DtExampleAlertDarkError,
  DtExampleAlertInteractive,
  DtExampleAlertError,
  DtExampleAlertWarning,
];

@NgModule({
  imports: [DtAlertModule, DtButtonModule],
  declarations: [...DT_ALERT_EXAMPLES],
  entryComponents: [...DT_ALERT_EXAMPLES],
})
export class AlertExampleModule {}
