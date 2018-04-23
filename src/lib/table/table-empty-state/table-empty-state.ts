import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state',
  styleUrls: ['table-empty-state.scss'],
  templateUrl: 'table-empty-state.html',
  exportAs: 'dtTableEmptyState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state',
  },
})
export class DtTableEmptyState {
  @Input() emptyTitle: string;
  @Input() emptyMessage: string;
}
