import { Directive, Input, NgZone, ElementRef, AfterViewInit, OnDestroy, Attribute, SimpleChanges } from '@angular/core';
import { DtSelectionArea } from './selection-area';
import { mixinTabIndex, mixinDisabled, DtViewportResizer, readKeyCode, addCssClass, removeCssClass, HasTabIndex, CanDisable } from '@dynatrace/angular-components/core';
import { take, takeUntil } from 'rxjs/operators';
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
  implements OnDestroy, AfterViewInit, HasTabIndex, CanDisable {

  @Input('dtSelectionArea')
  get selectionArea(): DtSelectionArea {
    return this._selectionArea;
  }
  set selectionArea(value: DtSelectionArea) {
    this._selectionArea = value;
  }

  protected _selectionArea: DtSelectionArea;

  private _selectionAreaGrabbingSub = Subscription.EMPTY;

  /** Emits when the component is destroyed */
  protected _destroy = new Subject<void>();

  constructor(
    protected _zone: NgZone,
    protected _elementRef: ElementRef,
    protected _viewport: DtViewportResizer,
    @Attribute('tabindex') tabIndex: string
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectionArea) {
      this._selectionAreaGrabbingSub.unsubscribe();
      this._selectionArea._grabbingChange.pipe(takeUntil(this._destroy)).subscribe((isGrabbing) => {
        if (isGrabbing) {
          addCssClass(this._elementRef.nativeElement, 'dt-selection-area-cursor-grabbing');
        } else {
          removeCssClass(this._elementRef.nativeElement, 'dt-selection-area-cursor-grabbing');
        }
      });
    }
  }

  /** @internal Handle mousedown on the origin */
  protected _handleMousedown(ev: MouseEvent): void {
    if (this._selectionArea) {
      this._selectionArea._create(ev.clientX);
    }
  }

  /** @internal Handle keydown on the origin */
  protected _handleKeyDown(event: KeyboardEvent): void {
    if (readKeyCode(event) === ENTER) {
      if (this._selectionArea) {
        this._selectionArea._create(0);
      }

      this._zone.onMicrotaskEmpty.pipe(take(1)).subscribe(() => { this.focus(); });
    }
  }

  ngAfterViewInit(): void {
    // This needs to be run after zone is stable because we need to wait until the origin is actually rendered
    // to get the correct boundaries
    this._zone.onStable.pipe(take(1)).subscribe(() => {
      this._applyBoundariesToSelectionArea();
    });

    this._viewport.change().pipe(takeUntil(this._destroy)).subscribe(() => {
      this._applyBoundariesToSelectionArea();
    });
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  protected _applyBoundariesToSelectionArea(): void {
    if (this._selectionArea) {
      const boundaries = this._elementRef.nativeElement.getBoundingClientRect();
      this._selectionArea._applyBoundaries(boundaries);
    }
  }
}
