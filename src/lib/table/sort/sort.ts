import { Directive, EventEmitter, Input, isDevMode, OnChanges, OnDestroy, Output, OnInit } from '@angular/core';
import { CanDisable, mixinDisabled } from '@dynatrace/angular-components/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { DtSortDirection } from './sort-direction';
import { getDtSortInvalidDirectionError } from './sort-errors';
import { DtSortHeader } from './sort-header';

/** The current sort state. */
export interface DtSortEvent {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: DtSortDirection;
}

/**
 * Boilerplate for applying mixins to DtSort.
 * @internal
 */
export class DtSortBase {}
export const _DtSortMixinBase = mixinDisabled(DtSortBase);

/** Container for DtSortHeaders to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[dtSort]',
  exportAs: 'dtSort',
  inputs: ['disabled: dtSortDisabled'],
})
export class DtSort extends _DtSortMixinBase
    implements CanDisable, OnChanges, OnInit, OnDestroy {

  /**
   * Used to notify any child components listening to state changes.
   * @internal
   */
  readonly _stateChanges = new Subject<void>();

  /** @internal Initialized subject that fires on initialization and completes on destroy. */
  readonly _initialized = new BehaviorSubject<boolean>(false);

  /** The id of the most recently sorted DtSortHeader. */
  @Input('dtSortActive') active: string;

  /**
   * The direction to set when an DtSortHeader is initially sorted.
   * May be overriden by the DtSortHeader's sort start.
   */
  @Input('dtSortStart') start: DtSortDirection = 'asc';

  /** The sort direction of the currently active DtSortHeader. */
  @Input('dtSortDirection')
  get direction(): DtSortDirection { return this._direction; }
  set direction(direction: DtSortDirection) {
    if (isDevMode() && direction && direction !== 'asc' && direction !== 'desc') {
      throw getDtSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: DtSortDirection = '';

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('dtSortChange') readonly sortChange: EventEmitter<DtSortEvent> = new EventEmitter<DtSortEvent>();

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: DtSortHeader): void {
    if (this.active !== sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }
    this.sortChange.emit({active: this.active, direction: this.direction});
  }

  /** Returns the next sort direction of the active sortable. */
  getNextSortDirection(sortable: DtSortHeader): DtSortDirection {
    if (!sortable) { return ''; }
    const sortDirectionCycle = getSortDirection(sortable.start || this.start);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) { nextDirectionIndex = 0; }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnInit(): void {
    this._initialized.next(true);
  }

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
    this._initialized.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirection(start: DtSortDirection): DtSortDirection[] {
  const sortOrder: DtSortDirection[] = ['asc', 'desc'];
  if (start === 'desc') { sortOrder.reverse(); }
  return sortOrder;
}
