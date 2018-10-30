import {
  Directive,
  EventEmitter,
  Input,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CanDisable, HasInitialized, mixinDisabled, mixinInitialized } from '@dynatrace/angular-components/core';
import { DtSortDirection } from './sort-direction';
import {
  getSortInvalidDirectionError
 } from './sort-errors';
import { Subject } from 'rxjs';

/** Interface for a directive that holds sorting state consumed by `DtSortHeader`. */
export interface DtSortable {
  /** The id of the column being sorted. */
  id: string;

  /** Starting sort direction. */
  start: DtSortDirection;
}

/** The current sort state. */
export interface DtSortEvent {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: DtSortDirection;
}

// Boilerplate for applying mixins to DtSort.
/** @internal */
export class DtSortBase {}
export const _DtSortMixinBase = mixinInitialized(mixinDisabled(DtSortBase));

/** Container for MatSortables to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[dtSort]',
  exportAs: 'dtSort',
  inputs: ['disabled: dtSortDisabled'],
})
export class DtSort extends _DtSortMixinBase
    implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit {
  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, DtSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted DtSortable. */
  @Input('dtSortActive') active: string;

  /** The sort direction of the currently active DtSortable. */
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
   * Register function to be used by the contained DtSortables. Adds the DtSortable to the
   * collection of DtSortables.
   */
  register(sortable: DtSortable): void {
    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained MatSortables. Removes the MatSortable from the
   * collection of contained MatSortables.
   */
  deregister(sortable: DtSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: DtSortable): void {
    if (this.active !== sortable.id) {
      this.active = sortable.id;
      console.log(sortable);
      this.direction = sortable.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({active: this.active, direction: this.direction});
  }

  /** Returns the next sort direction of the active sortable. */
  getNextSortDirection(sortable: DtSortable): DtSortDirection {
    if (!sortable) { return ''; }
    return this.direction === 'asc' ? 'desc' : 'asc';
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
