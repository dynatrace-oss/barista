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
  OnDestroy,
} from '@angular/core';
import { DtTable } from '../table';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { addCssClass, removeCssClass } from '@dynatrace/angular-components/core';
import { DtRow } from '../row';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { map, filter } from 'rxjs/operators';

let nextUniqueId = 0;
export class DtExpandableRowChangeEvent {
  constructor(public row: DtExpandableRow) {}
}

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
export class DtExpandableRow extends DtRow implements OnDestroy {
  private _expanded = false;
  private _uniqueId = `dt-expandable-row-${nextUniqueId++}`;

  /** The expanded state of the row. */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const coercedValue = coerceBooleanProperty(value);
    if (coercedValue) {
      this._expand();
    } else {
      this._collapse();
    }
  }

  /** Event emitted when the row's expandable state changes. */
  @Output() readonly expandChange = new EventEmitter<DtExpandableRowChangeEvent>();
  /** Event emitted when the row is expanded. */
  @Output('expanded') readonly _expandedStream = this.expandChange.pipe(filter((changeEvent) => changeEvent.row.expanded));
  /** Event emitted when the row is collapsed. */
  @Output('collapsed') readonly _collapsedStream = this.expandChange.pipe(filter((changeEvent) => !changeEvent.row.expanded));

  @ViewChild('dtExpandableRow', { static: true }) private _rowRef: ElementRef;

  constructor(
    // tslint:disable-next-line:no-any
    private _table: DtTable<any>,
    private _renderer2: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _expansionDispatcher: UniqueSelectionDispatcher,
    elementRef: ElementRef
  ) {
    super(elementRef);
    this._expansionDispatcher.listen((rowId, tableId) => {
      /**
       * If the table does not allow multiple rows to be expanded at a time,
       * the currently expanded row is collapsed.
       */
      if (this._table && !this._table.multiExpand &&
        this._table._uniqueId === tableId && this._uniqueId !== rowId) {
        this._collapse();
      }
    });
  }

  private _expand(): void {
    if (!this._expanded) {
      this._expanded = true;
      this._setExpandableCell(true);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  _collapse(): void {
    if (this._expanded) {
      this._expanded = false;
      this._setExpandableCell(false);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  _expandViaInteraction(): void {
    if (!this._expanded) {
      this._expanded = true;
      this._setExpandableCell(true);
      this._expansionDispatcher.notify(this._uniqueId, this._table._uniqueId);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
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
