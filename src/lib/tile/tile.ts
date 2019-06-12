import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
  ContentChild,
  ElementRef
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

/** Title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-title, [dt-tile-title], [dtTileTitle]`,
  host: {
    class: 'dt-tile-title',
  },
})
export class DtTileTitle { }

/** Icon of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-icon, [dt-tile-icon], [dtTileIcon]`,
  host: {
    class: 'dt-tile-icon',
  },
})
export class DtTileIcon {
}

/** Sub-title of a tile, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tile-subtitle, [dt-tile-subtitle], [dtTileSubtitle]`,
  host: {
    class: 'dt-tile-subtitle',
  },
})
export class DtTileSubtitle { }

export type DtTileThemePalette = 'main' | 'error' | 'recovered';

// Boilerplate for applying mixins to DtTile.
export class DtTileBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtTileMixinBase = mixinTabIndex(mixinDisabled(mixinColor<Constructor<DtTileBase>, DtTileThemePalette>(DtTileBase)));

@Component({
  moduleId: module.id,
  selector: 'dt-tile',
  exportAs: 'dtTile',
  templateUrl: 'tile.html',
  styleUrls: ['tile.scss'],
  inputs: ['disabled', 'tabIndex', 'color'],
  host: {
    'role': 'button',
    '[attr.tabindex]': 'tabIndex',
    '[attr.aria-disabled]': 'disabled.toString()',
    'class': 'dt-tile',
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
  implements CanDisable, HasElementRef, CanColor<DtTileThemePalette>, HasTabIndex {

  @ContentChild(DtTileSubtitle, { static: true }) _subTitle: DtTileSubtitle;
  @ContentChild(DtTileIcon, { static: true }) _icon: DtTileIcon;

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  _haltDisabledEvents(event: Event): void {
    // A disabled tile shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
