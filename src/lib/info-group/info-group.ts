import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
} from '@angular/core';

@Directive({
  selector: `dt-info-group-title, [dt-info-group-title], [dtInfoGroupTitle]`,
  host: {
    class: 'dt-info-group-title',
  },
})
export class DtInfoGroupTitle {}

/** Icon of the info group, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-info-group-icon, [dt-info-group-icon], [dtInfoGroupIcon]`,
  host: {
    class: 'dt-info-group-icon',
  },
})
export class DtInfoGroupIcon {}

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
export class DtInfoGroup {}
