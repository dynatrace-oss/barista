import { Component, ChangeDetectionStrategy, ViewEncapsulation, Directive } from '@angular/core';

/**
 * Defines the info group icon.
 * @deprecated Use 'dt-info-group-icon' instead
 * @breaking-change 3.0.0 To be removed
 */
@Directive({
  selector: 'dt-info-group-cell-icon, [dt-info-group-cell-icon], [dtInfoGroupCellIcon]',
  host: {
    class: 'dt-info-group-cell-icon',
  },
})
export class DtInfoGroupCellIcon {}

/**
 * Defines the info group title.
 * @deprecated Use 'dt-info-group-title' instead
 * @breaking-change 3.0.0 To be removed
 */
@Directive({
  selector: 'dt-info-group-cell-title, [dt-info-group-cell-title], [dtInfoGroupCellTitle]',
  host: {
    class: 'dt-info-group-cell-title',
  },
})
export class DtInfoGroupCellTitle {}

/**
 * @deprecated Use 'dt-info-group' instead
 * @breaking-change 3.0.0 To be removed
 */
@Component({
  selector: 'dt-info-group-cell',
  templateUrl: 'info-group-cell.html',
  styleUrls: ['info-group-cell.scss'],
  host: {
    class: 'dt-info-group-cell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtInfoGroupCell {}
