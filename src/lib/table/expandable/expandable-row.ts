import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, startWith } from 'rxjs/operators';

import {
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';

import { DtRow } from '../row';
import { DtTable } from '../table';

let nextUniqueId = 0;
export class DtExpandableRowChangeEvent {
  constructor(public row: DtExpandableRow) {}
}

@Directive({
  selector: 'ng-template[dtExpandableRowContent]',
  exportAs: 'DtExpandableRowContent',
})
export class DtExpandableRowContent {}

/**
 * Data row template container that contains the cell outlet and an expandable section.
 * Adds the right class and role.
 */
@Component({
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' }),
      ),
      state('expanded', style({ height: 'auto', visibility: 'visible' })),
      transition(
        'collapsed => expanded',
        animate(
          '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ height: 'auto', visibility: 'hidden', offset: 0.95 }),
            style({ height: 'auto', visibility: 'visible', offset: 1 }),
          ]),
        ),
      ),
      transition(
        'expanded => collapsed',
        animate(
          '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({ height: 'auto', visibility: 'hidden', offset: 0 }),
            style({
              height: '0px',
              minHeight: '0',
              visibility: 'hidden',
              offset: 1,
            }),
          ]),
        ),
      ),
    ]),
  ],
  moduleId: module.id,
  selector: 'dt-expandable-row',
  templateUrl: './expandable-row.html',
  styleUrls: ['./expandable-row.scss'],
  host: {
    role: 'row',
    class: 'dt-expandable-row',
    'class.dt-expandable-row-initial': '_pristine',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  exportAs: 'dtExpandableRow',
})
export class DtExpandableRow extends DtRow
  implements OnDestroy, AfterContentInit {
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
  @Output() readonly expandChange = new EventEmitter<
    DtExpandableRowChangeEvent
  >();
  /** @internal Event emitted when the row is expanded. */
  @Output('expanded') readonly _expandedStream = this.expandChange.pipe(
    filter(changeEvent => changeEvent.row.expanded),
  );
  /** @internal Event emitted when the row is collapsed. */
  @Output('collapsed') readonly _collapsedStream = this.expandChange.pipe(
    filter(changeEvent => !changeEvent.row.expanded),
  );

  @ViewChild('dtExpandableRow', { static: true }) private _rowRef: ElementRef;

  /** Querylist of content templates */
  @ContentChildren(DtExpandableRowContent, { read: TemplateRef })
  // tslint:disable-next-line: no-any
  private _expandableContentTemplates: QueryList<TemplateRef<{}>>;

  private _templateSubscription = Subscription.EMPTY;

  /** @internal the single reference that gets used in the template outlet */
  // tslint:disable-next-line: no-any
  _expandableContentTemplate: TemplateRef<any> | null;

  constructor(
    // tslint:disable-next-line:no-any
    private _table: DtTable<any>,
    private _renderer2: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _expansionDispatcher: UniqueSelectionDispatcher,
    elementRef: ElementRef,
  ) {
    super(elementRef);
    this._expansionDispatcher.listen((rowId, tableId) => {
      /**
       * If the table does not allow multiple rows to be expanded at a time,
       * the currently expanded row is collapsed.
       */
      if (
        this._table &&
        !this._table.multiExpand &&
        this._table._uniqueId === tableId &&
        this._uniqueId !== rowId
      ) {
        this._collapse();
      }
    });
  }

  ngAfterContentInit(): void {
    this._templateSubscription = this._expandableContentTemplates.changes
      .pipe(startWith(null))
      .subscribe(() => {
        this._expandableContentTemplate =
          this._expandableContentTemplates.first || null;
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._templateSubscription.unsubscribe();
  }

  private _expand(): void {
    if (!this._expanded) {
      this._expanded = true;
      this._setExpandableCell(true);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Collapses the row */
  _collapse(): void {
    if (this._expanded) {
      this._expanded = false;
      this._setExpandableCell(false);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Expands the row. This is only called as a result of an user action. */
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
    const cells = (this._rowRef
      .nativeElement as HTMLDivElement).querySelectorAll('dt-expandable-cell');
    [].slice.call(cells).forEach(cell => {
      (expanded ? addCssClass : removeCssClass)(
        cell,
        'dt-expandable-cell-expanded',
        this._renderer2,
      );
    });
  }
}
