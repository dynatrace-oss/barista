import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { DtTable } from './table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

/**
 * Data row template container that contains the cell outlet and an expandable section.
 * Adds the right class and role.
 */
@Component({
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('400ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  moduleId: module.id,
  selector: 'dt-expandable-row',
  templateUrl: './expandable-row.html',
  styleUrls: ['./scss/expandable-row.scss'],
  host: {
    class: 'dt-expandable-row',
    role: 'row',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtExpandableRow',
})
export class DtExpandableRow extends CdkRow {
  @Output() openedChange = new EventEmitter<DtExpandableRow>();
  @ViewChild('dtExpandableRow') private _rowRef: ElementRef;
  @ViewChild('dtExpandableContent', { read: ViewContainerRef }) private _expandable: ViewContainerRef;
  private _dtExpandMultiple = false;
  private _expanded = false;

  // tslint:disable-next-line:no-any
  constructor(private _dtExpandableTable: DtTable<any>) {
    super();
  }

  /** Multiple rows can be expanded at a time if set to true (default: false) */
  @Input()
  set dtExpandMultiple(value: boolean) {
    this._dtExpandMultiple = coerceBooleanProperty(value);
  }

  /** The expanded state of the row */
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    this.setExpanded(coerceBooleanProperty(value));
  }

  /** ViewContainerRef to the expandable section */
  get expandable(): ViewContainerRef {
    return this._expandable;
  }

  /** Click event handler */
  onClick(): void {
    if (this._dtExpandMultiple) { // multiple rows can be expanded, just handle the current one
      this.setExpanded(!this._expanded);
    } else { // only one row can be expanded
      if (this._dtExpandableTable.expandedRow !== undefined) { // a row is already expanded
        if (this._dtExpandableTable.expandedRow === this) { // expanded row was clicked => collapse it
          this.setExpanded(false);
        } else { // not the expanded row was clicked => collapse expanded, expand current row
          this._dtExpandableTable.expandedRow.expanded = !this._dtExpandableTable.expandedRow.expanded;
          this.setExpanded(true);
        }
      } else { // no row expanded yet, expand the current one
        this.setExpanded(true);
      }
    }
  }

  /** Sets the expanded state of the row, updates the expandable table and the expandable cell. */
  private setExpanded(expanded: boolean): void {
    this._expanded = expanded;
    this.setExpandableCell(expanded);
    this._dtExpandableTable.expandedRow = expanded ? this : undefined;
    this.openedChange.emit(this);
  }

  /** Sets the style of the expandable cell. Somehow a hack, a better solution would be appreciated. */
  private setExpandableCell(expanded: boolean): void {
    const rowElement = this._rowRef.nativeElement as HTMLDivElement;

    for (let i = 0; i < rowElement.childNodes.length; i++) {
      const node = rowElement.childNodes.item(i);
      if (node.localName === 'dt-expandable-cell') {
        const expandableCell = node as HTMLElement;
        const span = expandableCell.lastElementChild as HTMLSpanElement;
        span.className = expanded ? 'expanded' : '';
      }
    }
  }
}
