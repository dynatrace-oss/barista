import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ChangeDetectorRef,
  Output,
  AfterContentInit,
  ContentChildren,
  QueryList,
  NgZone,
} from '@angular/core';
import { DtToggleButtonItem, DtToggleButtonChange } from './toggle-button-item';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { merge, defer, Observable, Subject } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

/** DtToggleButtonGroup wraps the DtToggleButtonItems as a select 0 or 1 container. */
@Component({
  moduleId: module.id,
  selector: 'dt-toggle-button-group',
  exportAs: 'dtToggleButtonGroup',
  templateUrl: 'toggle-button-group.html',
  styleUrls: ['toggle-button-group.scss'],
  host: {
    'class': 'dt-toggle-button-group',
    'aria-multiselectable': 'false',
    'role': 'radiogroup',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtToggleButtonGroup<T> implements AfterContentInit {

  /** Gets the selected ToggleButtonItem. */
  get selectedItem(): DtToggleButtonItem<T> | null {
    return this._toggleButtonSelectionModel.selected[0] || null;
  }

  /** Get the value of the selected ToggleButtonItem. */
  get value(): T | null {
    return this.selectedItem ? this.selectedItem.value : null;
  }

  /** @internal Combined stream of all items change events. */
  readonly _itemSelectionChanges: Observable<DtToggleButtonChange<T>> = defer(() => {
    if (this._toggleButtonItems) {
      return merge(...this._toggleButtonItems.map((toggleButton) => toggleButton.change));
    }

    return this._ngZone.onStable
      .asObservable()
      .pipe(take(1), switchMap(() => this._itemSelectionChanges));
  });

  /** Output observable that fires every time the selection on the ToggleButtonGroup changes. */
  @Output() readonly change: Observable<DtToggleButtonChange<T>> = this._itemSelectionChanges;

  /** Emits whenever the group component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Selection model for the current ToggleButtonGroup. */
  private _toggleButtonSelectionModel = new SelectionModel<DtToggleButtonItem<T>>(false);

  /** @internal Content children which selects all DtToggleButtonItems within its content. */
  @ContentChildren(DtToggleButtonItem) _toggleButtonItems: QueryList<DtToggleButtonItem<T>>;

  constructor(private _ngZone: NgZone, private _changeDetectorRef: ChangeDetectorRef) { }

  /** ngAfterContentInit Hook to initialize contentChildren observables.  */
  ngAfterContentInit(): void {
    // subscribe to toggleButtonItems changes in the contentchildren.
    this._toggleButtonItems.changes
      .pipe(startWith(null), takeUntil(this._destroy))
      .subscribe(() => {
        this._resetItems();
        this._initializeToggleButtonItemSelection();
      });
    // subscribe to value changes in the selection model and handle selects/deselects accordingly.
    this._toggleButtonSelectionModel.changed
      .pipe(takeUntil(this._destroy))
      .subscribe((event) => {
        event.added.forEach((toggleButtonItem) => {
          toggleButtonItem.select();
        });
        event.removed.forEach((toggleButtonItem) => {
          toggleButtonItem.deselect();
        });
      });
  }

  /** On destroy of the component. */
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Initialize the selection if and map it to the selection model. */
  private _initializeToggleButtonItemSelection(): void {
    // Find an item that has set a select state via a selected property.
    const hasPreselectedItem = this._toggleButtonItems.length &&
      this._toggleButtonItems.toArray().find((toggleButton) => toggleButton.selected && !toggleButton.disabled);

    // If there is a preselected ToggleButtonItem in the list, set the selection
    // to the first preselected ToggleButtonItem that was found.
    if (hasPreselectedItem && this._toggleButtonItems.length) {
      this._toggleButtonSelectionModel.select(hasPreselectedItem);
      return;
    }
    this._toggleButtonSelectionModel.clear();
  }

  /** Reset all ToggleButtonItems */
  private _resetItems(): void {
    const changedOrDestroyed = merge(this._toggleButtonItems.changes, this._destroy);
    this._itemSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe((event) => {
      this._onItemSelect(event.source);
    });
  }

  /** Invoked when an item is clicked. */
  private _onItemSelect(toggleButtonItem: DtToggleButtonItem<T>): void {
    const wasSelected = this._toggleButtonSelectionModel.isSelected(toggleButtonItem);

    if (toggleButtonItem.selected) {
      this._toggleButtonSelectionModel.select(toggleButtonItem);
    } else {
      this._toggleButtonSelectionModel.deselect(toggleButtonItem);
    }

    if (wasSelected !== this._toggleButtonSelectionModel.isSelected(toggleButtonItem)) {
      this._changeDetectorRef.markForCheck();
    }
  }
}
