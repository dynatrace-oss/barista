import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
  ContentChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  CanDisable,
  mixinDisabled,
  HasTabIndex,
  mixinTabIndex,
  HasElementRef,
  CanColor,
  mixinColor,
  Constructor,
} from '@dynatrace/angular-components/core';
import { FocusMonitor } from '@angular/cdk/a11y';

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

export type DtTileThemePalette = 'main' | 'error' | 'recovered';

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
  moduleId: module.id,
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
  // tslint:disable-next-line:use-view-encapsulation
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtTile extends _DtTileMixinBase
  implements
    CanDisable,
    HasElementRef,
    CanColor<DtTileThemePalette>,
    HasTabIndex,
    OnDestroy {
  @ContentChild(DtTileSubtitle, { static: true }) _subTitle: DtTileSubtitle;
  @ContentChild(DtTileIcon, { static: true }) _icon: DtTileIcon;

  constructor(elementRef: ElementRef, private _focusMonitor: FocusMonitor) {
    super(elementRef);
    this._focusMonitor.monitor(this._elementRef);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  _haltDisabledEvents(event: Event): void {
    // A disabled tile shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
