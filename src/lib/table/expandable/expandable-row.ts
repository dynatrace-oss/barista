import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
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
import { DtTable } from '../table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';
import { DtRow } from '../row';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

let nextUniqueId = 0;

/**
 * Data row template container that contains the cell outlet and an expandable section.
 * Adds the right class and role.
 */
@Component({
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: 'auto', visibility: 'visible' })),
      transition('collapsed => expanded', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
        style({ height: 'auto', visibility: 'hidden', offset: 0.95 }),
        style({ height: 'auto', visibility: 'visible', offset: 1 }),
      ]))),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
        style({ height: 'auto', visibility: 'hidden', offset: 0 }),
        style({ height: '0px', minHeight: '0', visibility: 'hidden', offset: 1 }),
      ]))),
    ]),
  ],
  moduleId: module.id,
  selector: 'dt-expandable-row',
  templateUrl: './expandable-row.html',
  styleUrls: ['./expandable-row.scss'],
  host: {
    'role': 'row',
    'class': 'dt-expandable-row',
    'class.dt-expandable-row-initial': '_pristine',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtExpandableRow',
})
export class DtExpandableRow extends DtRow {
  /**
   * @deprecated Please use the multiExpand Input of the dt-table instead.
   * @breaking-change To be removed with 3.0.
   * Multiple rows can be expanded at a time if set to true (default: false)
   */
  @Input()
  set multiple(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (!this._table._multiExpand && coercedValue) {
      this._table._multiExpand = coercedValue;
    }
  }

  /** The expanded state of the row */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    this._expanded = coercedValue;
    this._pristine = false;
    this._setExpandableCell(this._expanded);
    // @breaking-change Remove with 3.0
    this._table.expandedRow = this._expanded ? this : undefined;
    this.openedChange.emit(this);
    if (this._expanded) {
      this.opened.emit(this);
      this._expansionDispatcher.notify(this._uniqueId, this._table._uniqueId);
    } else {
      this.closed.emit(this);
    }
    this._cdr.markForCheck();
  }

  /**
   * @deprecated Please use separate opened and closed outputs instead.
   * @breaking-change To be removed with 3.0
   */
  @Output() openedChange = new EventEmitter<DtExpandableRow>();
  @Output() opened = new EventEmitter<DtExpandableRow>();
  @Output() closed = new EventEmitter<DtExpandableRow>();

  @ViewChild('dtExpandableRow') private _rowRef: ElementRef;
  @ViewChild('dtExpandableContent', { read: ViewContainerRef }) private _contentViewContainer: ViewContainerRef;
  private _expanded = false;
  private _uniqueId = `dt-expandable-row-${nextUniqueId++}`;

  _pristine = true;

  /** ViewContainerRef to the expandable section */
  get contentViewContainer(): ViewContainerRef {
    return this._contentViewContainer;
  }

  // tslint:disable-next-line:no-any
  constructor(private _table: DtTable<any>,
              private _renderer2: Renderer2,
              private _cdr: ChangeDetectorRef,
              private _expansionDispatcher: UniqueSelectionDispatcher,
              _elementRef: ElementRef) {
    super(_elementRef);
    _expansionDispatcher.listen((rowId, tableId) => {
      /**
       * If the table does not allow multiple rows to be expanded at a time,
       * the currently expanded row is collapsed.
       */
      if (this._table && !this._table._multiExpand &&
        this._table._uniqueId === tableId && this._uniqueId !== rowId) {
        this.expanded = false;
      }
    });
  }

  toggle(): void {
    this.expanded = !this.expanded;
  }

  /** Sets the style of the expandable cell. */
  private _setExpandableCell(expanded: boolean): void {
    // Somehow a hack, a better solution would be appreciated.
    const cells = (this._rowRef.nativeElement as HTMLDivElement).querySelectorAll('dt-expandable-cell');
    [].slice.call(cells)
      .forEach((cell) => {
        (expanded ? addCssClass : removeCssClass)(cell, 'dt-expandable-cell-expanded', this._renderer2);
      });
  }
}
