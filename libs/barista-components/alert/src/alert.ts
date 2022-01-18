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

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { DtIconType } from '@dynatrace/barista-icons';

const ALERT_SEVERITY_TO_ICON_MAP: Record<string, DtIconType> = {
  error: 'criticalevent',
  warning: 'incident',
  info: 'information',
};

@Component({
  selector: 'dt-alert',
  templateUrl: 'alert.html',
  styleUrls: ['alert.scss'],
  host: {
    role: 'alert',
    class: 'dt-alert',
    '[class.dt-alert-warning]': 'severity === "warning"',
    '[class.dt-alert-info]': 'severity === "info"',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtAlert {
  /** The severity type of the alert. */
  @Input() severity: 'error' | 'warning' | 'info' = 'error';

  get severityIcon(): DtIconType {
    return (
      ALERT_SEVERITY_TO_ICON_MAP[this.severity] ??
      ALERT_SEVERITY_TO_ICON_MAP.error
    );
  }
}
