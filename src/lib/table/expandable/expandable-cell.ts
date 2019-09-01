import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

import { DtCell } from '../cell';
import { DtExpandableRow } from './expandable-row';

/**
 * Cell template that adds the right classes, role and static content for the details cell,
 * which can be used to indicate that a table row is expandable.
 */
@Component({
  selector: 'dt-expandable-cell',
  templateUrl: './expandable-cell.html',
  styleUrls: ['./expandable-cell.scss'],
  host: {
    class: 'dt-expandable-cell',
    role: 'gridcell',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  exportAs: 'dtExpandableCell',
})
export class DtExpandableCell extends DtCell {
  /**
   * @internal
   * Retyped for the AOT compiler, as _row member will always be a DtExpandableRow
   * for the DtExpandable cell.
   */
  _row: DtExpandableRow;

  /** Aria label applied to the cell for better accessibility. */
  @Input('aria-label') ariaLabel: string;
}
