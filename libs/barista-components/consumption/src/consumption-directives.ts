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

import { Component, Directive, TemplateRef, ViewChild } from '@angular/core';

/**
 * The consumption components' title.
 *
 * @example <dt-consumption-title>Host units</dt-consumption-title>
 */
@Directive({
  selector:
    'dt-consumption-title, [dt-consumption-title], [dtConsumptionTitle]',
  exportAs: 'dtConsumptionTitle',
  host: {
    class: 'dt-consumption-title',
  },
})
export class DtConsumptionTitle {}

/**
 * The consumption components' subtitle.
 *
 * @example <dt-consumption-subtitle>Quota</dt-consumption-subtitle>
 */
@Directive({
  selector:
    'dt-consumption-subtitle, [dt-consumption-subtitle], [dtConsumptionSubtitle]',
  exportAs: 'dtConsumptionSubtitle',
  host: {
    class: 'dt-consumption-subtitle',
  },
})
export class DtConsumptionSubtitle {}

/**
 * The consumption components' icon that is displayed next to the title.
 *
 * @example
 * <dt-consumption-icon aria-label="Host">
 *   <dt-icon name="host">/dt-icon>
 * </dt-consumption-icon>
 */
@Directive({
  selector: 'dt-consumption-icon, [dt-consumption-icon], [dtConsumptionIcon]',
  exportAs: 'dtConsumptionIcon',
  host: {
    class: 'dt-consumption-icon',
    role: 'img',
  },
})
export class DtConsumptionIcon {}

/**
 * A formatted value label shown below the progress bar.
 *
 * @example <dt-consumption-count>5/20</dt-consumption-count>.
 */
@Directive({
  selector:
    'dt-consumption-count, [dt-consumption-count], [dtConsumptionCount]',
  exportAs: 'dtConsumptionCount',
  host: {
    class: 'dt-consumption-count',
  },
})
export class DtConsumptionCount {}

/**
 * A more detailed description of what the progressbar and count label actually
 * represent.
 *
 * @example <dt-consumption-label>Restricted host unit hours</dt-consumption-label>
 */
@Directive({
  selector:
    'dt-consumption-label, [dt-consumption-label], [dtConsumptionLabel]',
  exportAs: 'dtConsumptionLabel',
  host: {
    class: 'dt-consumption-label',
  },
})
export class DtConsumptionLabel {}

/**
 * An overlay that is shown when the user moves his mouse over
 * the consumption component. The usage of the overlay is optional.
 *
 * @example <dt-consumption-overlay>My custom content</<dt-consumption-overlay>
 */
@Component({
  selector: 'dt-consumption-overlay',
  host: {
    class: 'dt-consumption-overlay',
  },
  template: `
    <ng-template #overlayTemplate>
      <div dtTheme=":light">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class DtConsumptionOverlay {
  /** @internal The template that is being displayed in the overlay */
  @ViewChild('overlayTemplate', { static: true, read: TemplateRef })
  _overlayTemplate: TemplateRef<void>;
}
