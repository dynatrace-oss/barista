import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-empty-state',
  styleUrls: ['empty-state.scss'],
  templateUrl: 'empty-state.html',
  exportAs: 'dtEmptyState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-empty-state',
  },
})
export class DtEmptyState {
  @Input() emptyTitle: string;
  @Input() emptyMessage: string;
}
