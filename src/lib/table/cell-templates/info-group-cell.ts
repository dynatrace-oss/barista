import { Component, ChangeDetectionStrategy, ViewEncapsulation, Directive } from '@angular/core';

@Directive({
  selector: 'dt-info-group-cell-icon',
  host: {
    class: 'dt-info-group-cell-icon',
  },
})
export class DtInfoGroupCellIcon {}

@Directive({
  selector: 'dt-info-group-cell-title',
  host: {
    class: 'dt-info-group-cell-title',
  }
})
export class DtInfoGroupCellTitle {}

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