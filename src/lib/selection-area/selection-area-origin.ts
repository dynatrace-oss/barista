import {
  Directive,
  Input,
  NgZone,
  ElementRef,
  OnDestroy,
  Attribute,
  SimpleChanges,
  OnChanges,
  AfterViewInit,
} from '@angular/core';
import { DtSelectionArea } from './selection-area';
import {
  mixinDisabled,
  DtViewportResizer,
  CanDisable,
  mixinTabIndex,
  HasTabIndex,
  readKeyCode,
  addCssClass,
  removeCssClass,
} from '@dynatrace/angular-components/core';
import { take, takeUntil, switchMap } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { ENTER } from '@angular/cdk/keycodes';

export class DtSelectionAreaOriginBase { }
export const _DtSelectionAreaOriginMixin = mixinTabIndex(mixinDisabled(DtSelectionAreaOriginBase));

@Directive({
  selector: '[dtSelectionArea]',
  exportAs: 'dtSelectionAreaOrigin',
  host: {
    'class': 'dt-selection-area-origin',
    '[attr.tabindex]': 'tabIndex',
    '(mousedown)': '_handleMousedown($event)',
    '(keydown)': '_handleKeyDown($event)',
  },
  inputs: ['tabIndex'],
})
export class DtSelectionAreaOrigin extends _DtSelectionAreaOriginMixin
implements OnDestroy, OnChanges, AfterViewInit, HasTabIndex, CanDisable {

  /** The selection area connected to this origin */
  @Input('dtSelectionArea') selectionArea: DtSelectionArea;

  private _selectionAreaGrabbingSub = Subscription.EMPTY;

  /** @internal Emits when the component is destroyed */
  protected _destroy = new Subject<void>();

  constructor(
    private _zone: NgZone,
    protected _elementRef: ElementRef,
    private _viewport: DtViewportResizer,
    @Attribute('tabindex') tabIndex: string
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit(): void {
    this._viewport.change().pipe(takeUntil(this._destroy), switchMap(() => this._zone.onStable.pipe(take(1)))).subscribe(() => {
      if (this.selectionArea) {
        this._emitBoundariesChangedOnSelectionArea();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectionArea) {
      this._zone.onStable.pipe(
        takeUntil(this._destroy),
        take(1)
      ).subscribe(() => { this._emitBoundariesChangedOnSelectionArea(); });
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

      this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => { this.focus(); });
    }
  }

  /** React to the grabbing change event from the selection area */
  protected _handleGrabbingChange(): void {
    this._selectionAreaGrabbingSub.unsubscribe();
    this.selectionArea._grabbingChange.pipe(takeUntil(this._destroy)).subscribe((isGrabbing) => {
      if (isGrabbing) {
        addCssClass(this._elementRef.nativeElement, 'dt-selection-area-cursor-grabbing');
      } else {
        removeCssClass(this._elementRef.nativeElement, 'dt-selection-area-cursor-grabbing');
      }
    });
  }

  /** Emits the boundariesChanged on the selection area */
  private _emitBoundariesChangedOnSelectionArea(): void {
    this.selectionArea._boundariesChanged.next(this._elementRef.nativeElement.getBoundingClientRect());
  }
}
