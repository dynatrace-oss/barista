import { Directive, EventEmitter, Input, isDevMode, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { CanDisable, HasInitialized, mixinDisabled, mixinInitialized } from '@dynatrace/angular-components/core';
import { Subject } from 'rxjs';
import { DtSortDirection } from './sort-direction';
import { getSortInvalidDirectionError } from './sort-errors';
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
export const _DtSortMixinBase = mixinInitialized(mixinDisabled(DtSortBase));

/** Container for DtSortHeaders to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[dtSort]',
  exportAs: 'dtSort',
  inputs: ['disabled: dtSortDisabled'],
})
export class DtSort extends _DtSortMixinBase
    implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit {
  /** Collection of all registered sort headers that this directive manages. */
  _sortables = new Map<string, DtSortHeader>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

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
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: DtSortDirection = '';

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('dtSortChange') readonly sortChange: EventEmitter<DtSortEvent> = new EventEmitter<DtSortEvent>();

  /**
   * Register function to be used by the contained DtSortHeader. Adds the DtSortHeader to the
   * collection of DtSortHeader.
   */
  register(sortable: DtSortHeader): void {
    this._sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained DtSortHeader. Removes the DtSortHeader from the
   * collection of contained DtSortHeaders.
   */
  deregister(sortable: DtSortHeader): void {
    this._sortables.delete(sortable.id);
  }

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
    this._markInitialized();
  }

  ngOnChanges(): void {
    this._stateChanges.next();
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirection(start: DtSortDirection): DtSortDirection[] {
  const sortOrder: DtSortDirection[] = ['asc', 'desc'];
  if (start === 'desc') { sortOrder.reverse(); }
  return sortOrder;
}
