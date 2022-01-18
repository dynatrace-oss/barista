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

import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';

import {
  CanColor,
  CanDisable,
  Constructor,
  HasElementRef,
  HasTabIndex,
  mixinColor,
  mixinDisabled,
  mixinTabIndex,
} from '@dynatrace/barista-components/core';

/** Title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-title, [dt-tile-title], [dtTileTitle]`,
  exportAs: 'dtTileTitle',
  host: {
    class: 'dt-tile-title',
  },
})
export class DtTileTitle {}

/** Icon of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-icon, [dt-tile-icon], [dtTileIcon]`,
  exportAs: 'dtTileIcon',
  host: {
    class: 'dt-tile-icon',
  },
})
export class DtTileIcon {}

/** Sub-title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-subtitle, [dt-tile-subtitle], [dtTileSubtitle]`,
  exportAs: 'dtTileSubtitle',
  host: {
    class: 'dt-tile-subtitle',
  },
})
export class DtTileSubtitle {}

export type DtTileThemePalette = 'main' | 'warning' | 'error' | 'recovered';

// Boilerplate for applying mixins to DtTile.
export class DtTileBase {
  constructor(public _elementRef: ElementRef) {}
}
export const _DtTileMixinBase = mixinTabIndex(
  mixinDisabled(
    mixinColor<Constructor<DtTileBase>, DtTileThemePalette>(DtTileBase),
  ),
);

@Component({
  selector: 'dt-tile',
  exportAs: 'dtTile',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  inputs: ['disabled', 'tabIndex', 'color'],
  host: {
    role: 'button',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-disabled]': 'disabled.toString()',
    class: 'dt-tile',
    '[class.dt-tile-small]': '!_subTitle',
    '[class.dt-tile-disabled]': 'disabled',
    '(click)': '_haltDisabledEvents($event)',
  },
  // eslint-disable-next-line
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTile
  extends _DtTileMixinBase
  implements
    CanDisable,
    HasElementRef,
    CanColor<DtTileThemePalette>,
    HasTabIndex,
    OnDestroy
{
  /** @internal The tiles subtitle */
  @ContentChild(DtTileSubtitle, { static: true }) _subTitle: DtTileSubtitle;

  /** @internal The tiles icon */
  @ContentChild(DtTileIcon, { static: true }) _icon: DtTileIcon;

  constructor(elementRef: ElementRef, private _focusMonitor: FocusMonitor) {
    super(elementRef);
    this._focusMonitor.monitor(this._elementRef);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /** @internal A disabled tile shouldn't apply any actions */
  _haltDisabledEvents(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
