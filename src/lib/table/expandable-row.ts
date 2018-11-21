import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { CdkRow, CdkCellOutlet } from '@angular/cdk/table';
import { DtTable } from './table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';

/**
 * Data row template container that contains the cell outlet and an expandable section.
 * Adds the right class and role.
 */
@Component({
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
        style({ height: '*', visibility: 'hidden', offset: 0.95 }),
        style({ height: '*', visibility: 'visible', offset: 1 }),
      ]))),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
        style({ visibility: 'hidden', offset: 0 }),
        style({ height: '0px', minHeight: '0', visibility: 'hidden', offset: 1 }),
      ]))),
    ]),
  ],
  moduleId: module.id,
  selector: 'dt-expandable-row',
  templateUrl: './expandable-row.html',
  styleUrls: ['./scss/expandable-row.scss'],
  host: {
    'role': 'row',
    'class': 'dt-expandable-row',
    'class.dt-expandable-row-initial': '_pristine',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtExpandableRow',
})
export class DtExpandableRow extends CdkRow {
  @Output() openedChange = new EventEmitter<DtExpandableRow>();
  @ViewChild('dtExpandableRow') private _rowRef: ElementRef;
  @ViewChild('dtExpandableContent', { read: ViewContainerRef }) private _contentViewContainer: ViewContainerRef;
  private _multiple = false;
  private _expanded = false;

  _pristine = true;

  @ViewChild(CdkCellOutlet) _cellOutlet: CdkCellOutlet;

  /** Multiple rows can be expanded at a time if set to true (default: false) */
  @Input()
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }

  /** The expanded state of the row */
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    this._setExpanded(coerceBooleanProperty(value));
  }

  /** ViewContainerRef to the expandable section */
  get contentViewContainer(): ViewContainerRef {
    return this._contentViewContainer;
  }

  // tslint:disable-next-line:no-any
  constructor(private _expandableTable: DtTable<any>,
              private _renderer2: Renderer2,
              private _cdr: ChangeDetectorRef) {
    super();
  }

  /**
   * Toggles the expanded state of the row. If the row is already expanded it is collapsed, otherwise it is expanded.
   * If the table does not allow multiple rows to be expanded at a time, which is the default behavior,
   * the currently expanded row (if any) is collapsed.
   */
  toggle(): void {
    if (this._multiple) { // multiple rows can be expanded, just handle the current one
      this._setExpanded(!this._expanded);
      return;
    }

    if (this._expandableTable.expandedRow === undefined) { // no expanded row yet
      this._setExpanded(true);
      return;
    }

    if (this._expandableTable.expandedRow === this) { // expanded row was clicked => collapse it
      this._setExpanded(false);
      return;
    }

    // not the expanded row was clicked => collapse expanded, expand current row
    this._expandableTable.expandedRow.expanded = !this._expandableTable.expandedRow.expanded;
    this._setExpanded(true);
  }

  /** Sets the expanded state of the row, updates the expandable table and the expandable cell. */
  private _setExpanded(expanded: boolean): void {
    this._expanded = expanded;
    this._pristine = false;
    this._setExpandableCell(expanded);
    this._expandableTable.expandedRow = expanded ? this : undefined;
    this.openedChange.emit(this);
    this._cdr.markForCheck();
  }

  /** Sets the style of the expandable cell. */
  private _setExpandableCell(expanded: boolean): void {
    // Somehow a hack, a better solution would be appreciated.
    const cells = (this._rowRef.nativeElement as HTMLDivElement).querySelectorAll('dt-expandable-cell');
    cells.forEach((cell) => { (expanded ? addCssClass : removeCssClass)(cell, 'dt-expandable-cell-expanded', this._renderer2); });
  }
}
