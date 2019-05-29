import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  Input,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-secondary-nav-group',
  exportAs: 'dtSecondaryNavGroup',
  template: `
    <div class="dt-secondary-nav-group-title">{{ label }}</div>
    <ng-content></ng-content>
  `,
  host: {
    class: 'dt-secondary-nav-group',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSecondaryNavGroup {
  /** The text value of the group header */
  @Input() label: string;
}
