import { Directive, Input, NgZone, ElementRef, AfterViewInit, OnDestroy, Attribute } from '@angular/core';
import { DtSelectionArea } from './selection-area';
import { mixinTabIndex, mixinDisabled, DtViewportResizer, readKeyCode } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';
import { Subscription, EMPTY } from 'rxjs';
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
export class DtSelectionAreaOrigin extends _DtSelectionAreaOriginMixin implements OnDestroy, AfterViewInit {

  @Input('dtSelectionArea')
  get selectionArea(): DtSelectionArea {
    return this._selectionArea;
  }
  set selectionArea(value: DtSelectionArea) {
    this._selectionArea = value;
  }

  private _selectionArea: DtSelectionArea;

  /** Subscription to the viewport changes */
  private _viewportSub: Subscription = EMPTY.subscribe();

  constructor(
    private _zone: NgZone,
    private _elementRef: ElementRef,
    private _viewport: DtViewportResizer,
    @Attribute('tabindex') tabIndex: string
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /** @internal Handle mousedown on the origin */
  _handleMousedown(ev: MouseEvent): void {
    if (this._selectionArea) {
      this._selectionArea._create(ev.clientX);
    }
  }

  /** @internal Handle keydown on the origin */
  _handleKeyDown(event: KeyboardEvent): void {
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

    this._viewportSub = this._viewport.change().subscribe(() => {
      this._applyBoundariesToSelectionArea();
    });
  }

  ngOnDestroy(): void {
    this._viewportSub.unsubscribe();
  }

  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  private _applyBoundariesToSelectionArea(): void {
    if (this._selectionArea) {
      const boundaries = this._elementRef.nativeElement.getBoundingClientRect();
      this._selectionArea._applyBoundaries(boundaries);
    }
  }
}
