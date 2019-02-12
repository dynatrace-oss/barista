import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
  ElementRef,
} from '@angular/core';

import {
  CanColor,
  mixinColor,
  Constructor,
  HasElementRef,
} from '@dynatrace/angular-components/core';

@Directive({
  selector: `dt-info-group-title, [dt-info-group-title], [dtInfoGroupTitle]`,
  host: {
    class: 'dt-info-group-title',
  },
})
export class DtInfoGroupTitle {
}

/** Icon of the info group, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-info-group-icon, [dt-info-group-icon], [dtInfoGroupIcon]`,
  host: {
    class: 'dt-info-group-icon',
  },
})
export class DtInfoGroupIcon {
}

export type DtInfoGroupThemePalette = 'main';

// Boilerplate for applying mixins to DtInfoGroup.
export class DtInfoGroupBase {
  constructor(public _elementRef: ElementRef) { }
}

export const _DtInfoGroupMixinBase = mixinColor<Constructor<DtInfoGroupBase>, DtInfoGroupThemePalette>(DtInfoGroupBase);

@Component({
  moduleId: module.id,
  selector: 'dt-info-group',
  exportAs: 'dtInfoGroup',
  templateUrl: 'info-group.html',
  styleUrls: ['info-group.scss'],
  host: {
    class: 'dt-info-group',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})

export class DtInfoGroup extends _DtInfoGroupMixinBase implements HasElementRef, CanColor<DtInfoGroupThemePalette> {

}
