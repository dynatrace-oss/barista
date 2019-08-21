import { ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Attribute,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import {
  CanDisable,
  DtViewportResizer,
  HasTabIndex,
  addCssClass,
  mixinDisabled,
  mixinTabIndex,
  readKeyCode,
  removeCssClass,
} from '@dynatrace/angular-components/core';

import { DtSelectionArea } from './selection-area';

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
export class DtSelectionAreaOriginBase {}

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
export const _DtSelectionAreaOriginMixin = mixinTabIndex(
  // tslint:disable-next-line: deprecation
  mixinDisabled(DtSelectionAreaOriginBase),
);

/**
 * @deprecated The selection area will be replaced with the chart selection area
 * @breaking-change To be removed with 5.0.0.
 */
@Directive({
  selector: '[dtSelectionArea]',
  exportAs: 'dtSelectionAreaOrigin',
  host: {
    class: 'dt-selection-area-origin',
    '[attr.tabindex]': 'tabIndex',
    '(mousedown)': '_handleMousedown($event)',
    '(keydown)': '_handleKeyDown($event)',
  },
  inputs: ['tabIndex'],
})
// tslint:disable-next-line: deprecation
export class DtSelectionAreaOrigin extends _DtSelectionAreaOriginMixin
  implements OnDestroy, OnChanges, AfterViewInit, HasTabIndex, CanDisable {
  /** The selection area connected to this origin */
  // tslint:disable-next-line: deprecation
  @Input('dtSelectionArea') selectionArea: DtSelectionArea;

  private _selectionAreaGrabbingSub = Subscription.EMPTY;

  /** @internal Emits when the component is destroyed */
  protected _destroy = new Subject<void>();

  constructor(
    private _zone: NgZone,
    protected _elementRef: ElementRef,
    private _viewport: DtViewportResizer,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    this._viewport
      .change()
      .pipe(
        takeUntil(this._destroy),
        switchMap(() => this._zone.onStable.pipe(take(1))),
      )
      .subscribe(() => {
        if (this.selectionArea) {
          this._emitBoundariesChangedOnSelectionArea();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectionArea) {
      this._zone.onStable
        .pipe(
          takeUntil(this._destroy),
          take(1),
        )
        .subscribe(() => {
          this._emitBoundariesChangedOnSelectionArea();
        });
      this._handleGrabbingChange();
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  /** Focuses the origin for the selection area */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  /** @internal Handle mousedown on the origin */
  protected _handleMousedown(ev: MouseEvent): void {
    if (this.selectionArea) {
      this.selectionArea._createSelectedArea(ev.clientX);
    }
  }

  /** @internal Handle keydown on the origin */
  protected _handleKeyDown(event: KeyboardEvent): void {
    if (readKeyCode(event) === ENTER) {
      if (this.selectionArea) {
        this.selectionArea._createSelectedArea(0);
      }

      this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => {
        this.focus();
      });
    }
  }

  /** React to the grabbing change event from the selection area */
  protected _handleGrabbingChange(): void {
    this._selectionAreaGrabbingSub.unsubscribe();
    this.selectionArea._grabbingChange
      .pipe(takeUntil(this._destroy))
      .subscribe(isGrabbing => {
        if (isGrabbing) {
          addCssClass(
            this._elementRef.nativeElement,
            'dt-selection-area-cursor-grabbing',
          );
        } else {
          removeCssClass(
            this._elementRef.nativeElement,
            'dt-selection-area-cursor-grabbing',
          );
        }
      });
  }

  /** Emits the boundariesChanged on the selection area */
  private _emitBoundariesChangedOnSelectionArea(): void {
    this.selectionArea._boundariesChanged.next(
      this._elementRef.nativeElement.getBoundingClientRect(),
    );
  }
}
