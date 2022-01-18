/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  animate,
  keyframes,
  style,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer,
} from '@angular/animations';
import { coerceBooleanProperty, BooleanInput } from '@angular/cdk/coercion';
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
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { filter, startWith, distinctUntilChanged } from 'rxjs/operators';

import {
  _addCssClass,
  _removeCssClass,
} from '@dynatrace/barista-components/core';

import { DtRow } from '../row';
import { DtTable } from '../table';

let nextUniqueId = 0;

const COLLAPSE_ANIMATE = [
  animate(
    '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    keyframes([
      style({ height: 'auto', visibility: 'hidden', offset: 0 }),
      style({
        height: '0px',
        minHeight: '0px',
        visibility: 'hidden',
        offset: 1,
      }),
    ]),
  ),
];

const EXPAND_ANIMATE = [
  animate(
    '225ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    keyframes([
      style({ height: 'auto', visibility: 'hidden', offset: 0.95 }),
      style({ height: 'auto', visibility: 'visible', offset: 1 }),
    ]),
  ),
];

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
export class DtExpandableRow
  extends DtRow
  implements OnDestroy, AfterContentInit
{
  private _uniqueId = `dt-expandable-row-${nextUniqueId++}`;

  /** Animation state of the expanded / collapsed row. */
  private _animationState = new BehaviorSubject<'collapsed' | 'expanded'>(
    'collapsed',
  );
  private _animationStateSubscription = Subscription.EMPTY;

  /** AnimationFactory for the collapse animation. */
  private _collapseAnimation: AnimationFactory;
  /** AnimationFactory for the expand animation. */
  private _expandAnimation: AnimationFactory;

  /** AnimationPlayer reference for the expand animation. */
  private _expandPlayer: AnimationPlayer;
  /** AnimationPlayer reference for the collapse animation. */
  private _collapsePlayer: AnimationPlayer;

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
  private _expanded = false;
  static ngAcceptInputType_expanded: BooleanInput;

  /** Event emitted when the row's expandable state changes. */
  @Output()
  readonly expandChange = new EventEmitter<DtExpandableRowChangeEvent>();
  /** @internal Event emitted when the row is expanded. */
  @Output('expanded') readonly _expandedStream = this.expandChange.pipe(
    filter((changeEvent) => changeEvent.row.expanded),
  );
  /** @internal Event emitted when the row is collapsed. */
  @Output('collapsed')
  readonly _collapsedStream: Observable<DtExpandableRowChangeEvent> = this.expandChange.pipe(
    filter((changeEvent) => !changeEvent.row.expanded),
  );

  @ViewChild('dtExpandableRow', { static: true }) private _rowRef: ElementRef;

  @ViewChild('expandableAnimationContainer', { static: true })
  private _animationContainerRef: ElementRef;

  /** Querylist of content templates */
  @ContentChildren(DtExpandableRowContent, { read: TemplateRef })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _expandableContentTemplates: QueryList<TemplateRef<any>>;

  private _templateSubscription = Subscription.EMPTY;

  /** @internal the single reference that gets used in the template outlet */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _expandableContentTemplate: TemplateRef<any> | null;

  private _selectionDispatchCleanup: () => void;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _table: DtTable<any>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _expansionDispatcher: UniqueSelectionDispatcher,
    elementRef: ElementRef,
    _animationBuilder: AnimationBuilder,
  ) {
    super(elementRef);
    this._table._hasExpandableRows = true;
    this._selectionDispatchCleanup = this._expansionDispatcher.listen(
      (rowId, tableId) => {
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
      },
    );

    this._collapseAnimation = _animationBuilder.build(COLLAPSE_ANIMATE);
    this._expandAnimation = _animationBuilder.build(EXPAND_ANIMATE);
  }

  ngAfterContentInit(): void {
    this._templateSubscription = this._expandableContentTemplates.changes
      .pipe(startWith(null))
      .subscribe(() => {
        this._expandableContentTemplate =
          this._expandableContentTemplates.first || null;
        this._changeDetectorRef.markForCheck();
      });

    this._animationStateSubscription = this._animationState
      .pipe(distinctUntilChanged())
      .subscribe((state) => {
        if (state === 'collapsed') {
          // We need to recreate the player connected to the native element
          // as the table recycles the elements internally and
          // the angular decorator animation did not pick up on that change.
          this._collapsePlayer = this._collapseAnimation.create(
            this._animationContainerRef.nativeElement,
          );
          this._collapsePlayer.play();
        }

        if (state === 'expanded') {
          this._expandPlayer = this._expandAnimation.create(
            this._animationContainerRef.nativeElement,
          );
          this._expandPlayer.play();
        }
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this._expandPlayer) {
      this._expandPlayer.destroy();
    }
    if (this._collapsePlayer) {
      this._collapsePlayer.destroy();
    }
    this._animationStateSubscription.unsubscribe();
    this._templateSubscription.unsubscribe();
    if (this._selectionDispatchCleanup) {
      this._selectionDispatchCleanup();
    }
  }

  private _expand(): void {
    if (!this._expanded) {
      this._animationState.next('expanded');
      this._expanded = true;
      this._setExpandableCell(true);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Collapses the row */
  _collapse(): void {
    if (this._expanded) {
      this._animationState.next('collapsed');
      this._expanded = false;
      this._setExpandableCell(false);
      this.expandChange.emit(new DtExpandableRowChangeEvent(this));
      this._changeDetectorRef.markForCheck();
    }
  }

  /** @internal Expands the row. This is only called as a result of an user action. */
  _expandViaInteraction(): void {
    if (!this._expanded) {
      this._animationState.next('expanded');
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
    const cells = (
      this._rowRef.nativeElement as HTMLDivElement
    ).querySelectorAll('dt-expandable-cell');
    [].slice.call(cells).forEach((cell) => {
      (expanded ? _addCssClass : _removeCssClass)(
        cell,
        'dt-expandable-cell-expanded',
      );
    });
  }
}
