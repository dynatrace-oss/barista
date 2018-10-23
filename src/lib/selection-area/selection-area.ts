import { Component, EventEmitter, Output, ElementRef, Input, Renderer2, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, Host, NgZone, Directive } from '@angular/core';
import { addCssClass, clamp, removeCssClass, DtViewportResizer } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';

/** Change event object emitted by DtCheckbox */
export interface DtSelectionAreaChange {
  source: DtSelectionArea;
  left: number;
  width: number;
  right: number;
}

export const DT_NO_INTERACTION_CSS_CLASS = 'dt-no-interaction';
export const DT_CHART_INTERACTION_OVERLAY_SPACING = 10;

export type DtSelectionAreaEventTarget = 'box' | 'left-handle' | 'right-handle' | 'origin';

/** Action area in the overlay, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-selection-area-actions, [dt-selection-area-actions], [dtSelectionAreaActions]`,
  host: {
    class: 'dt-selection-area-actions',
  },
})
export class DtSelectionAreaActions { }

@Component({
  selector: 'dt-selection-area',
  templateUrl: 'selection-area.html',
  styleUrls: ['selection-area.scss'],
  host: {
    class: 'dt-selection-area, dt-no-interaction',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DtSelectionArea {

  _isBoxVisible = false;

  _positions = [
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -DT_CHART_INTERACTION_OVERLAY_SPACING,
    },
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: DT_CHART_INTERACTION_OVERLAY_SPACING,
    },
  ];

  /** Indicator if its being touched */
  private _touching: boolean;
  private _startX: number;
  private _startWidth: number;
  private _origin: HTMLElement;
  private _width = 0;
  private _offsetX = 0;
  private _left: number | null;
  private _right: number | null;
  private _boundaries: ClientRect;
  private _eventTarget: DtSelectionAreaEventTarget;
  private _detachMousedownFn: () => void = () => {};
  private _detachFns: Array<() => void> = [];

  @ViewChild('box') _box: ElementRef;
  @ViewChild(CdkConnectedOverlay) _overlay: CdkConnectedOverlay;

  @Input()
  get origin(): ElementRef | HTMLElement {
    return this._origin;
  }
  set origin(val: ElementRef | HTMLElement) {
    this._detachEventListeners();
    this._detachWindowListeners();
    this._origin = val instanceof ElementRef ? val.nativeElement : val;

    // apply eventlisteners
    this._attachEventListeners();
    this._applyBoundaries(this._origin);
  }

  @Output()
  readonly changed: EventEmitter<DtSelectionAreaChange> = new EventEmitter();

  @Output()
  readonly closed: EventEmitter<void> = new EventEmitter();

  constructor(
    private _ref: ElementRef,
    private _renderer: Renderer2,
    private _zone: NgZone,
    private _viewport: DtViewportResizer,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    this._viewport.change().subscribe(() => {
      this._reset();
    });
  }

  ngOnDestroy(): void {
    this._detachEventListeners();
    this._detachWindowListeners();
  }

  private _attachEventListeners(): void {
    this._detachMousedownFn = this._renderer.listen(this._origin, 'mousedown', this._handleMousedown);
  }

  private _attachWindowEventListeners(): void {
    this._detachWindowListeners();
    // tslint:disable-next-line:strict-type-predicates
    if (typeof window !== 'undefined') {
      this._zone.runOutsideAngular(() => {
        this._detachFns.push(this._renderer.listen(window, 'mousemove', this._handleMousemove));
        this._detachFns.push(this._renderer.listen(window, 'mouseup', this._handleMouseup));
      });
    }
  }

  private _detachWindowListeners(): void {
    this._detachFns.forEach((fn) => fn());
    this._detachFns = [];
  }

  private _detachEventListeners(): void {
    this._detachMousedownFn();
    this._detachMousedownFn = () => {};
  }

  private _handleMousedown = (ev: MouseEvent) => {
    this._isBoxVisible = true;
    this._touching = true;
    this._applyPointerEvents(true);
    this._attachWindowEventListeners();
    this._eventTarget = 'origin';
    this._startX = this._calculateRelativeXPos(ev);
    this._left = this._startX;
    // Call update to trigger reflecting the changes to the element
    this._update();
    this._changeDetectorRef.markForCheck();
  }

  private _handleMousemove = (ev: MouseEvent) => {
    ev.preventDefault();
    const deltaX = this._calculateRelativeXPos(ev) - this._startX;
    let left: number | null;
    let right: number | null;
    let width = this._width;
    /** Check if an eventtarget is available - if not it is the creation interaction */
    switch (this._eventTarget) {
      case 'box':
        const newleft = this._startX + deltaX - this._offsetX;
        left = clamp(newleft, 0, this._boundaries.width - width);
        right = null;
        break;
      case 'left-handle':
        if (this._startWidth - deltaX < 0) {
          width = deltaX - this._startWidth;
          right = null;
          left = this._startX + this._startWidth;
        } else {
          /** cursor is moved over the area until it hits the right handle */
          width = this._startWidth - deltaX;
          left = null;
          right = this._boundaries.width - this._startX - this._startWidth;
        }
        break;
      case 'right-handle':
        if (this._startWidth + deltaX < 0) {
          width = Math.abs(this._startWidth + deltaX);
          left = null;
          right = this._boundaries.width - this._startX + this._startWidth;
        } else {
          /** cursor is moved to the right */
          left = this._startX - this._startWidth;
          right = null;
          width = this._startWidth + deltaX;
        }
        break;
      case 'origin':
      default:
        width = Math.abs(deltaX);
        if (deltaX >= 0) {
          left = this._startX;
          right = null;
        } else {
          left = null;
          right = this._boundaries.width - this._startX;
        }
    }
    /** clamp */
    if (left !== null) {
      width = clamp(width, 0, this._boundaries.width - left);
    }
    if (right !== null) {
      width = clamp(width, 0, this._boundaries.width - right);
    }
    this._width = width;
    this._left = left;
    this._right = right;
  }

  private _handleMouseup = (ev: MouseEvent) => {
    ev.preventDefault();
    removeCssClass(this._box.nativeElement, 'dt-grabbing');
    this._touching = false;
    this._applyPointerEvents(false);
    this._detachFns.forEach((fn) => fn());
  }

  /** handle mousedown on the left handle */
  _handleLeftHandleMouseDown(event: MouseEvent): void {
    this._handleBoxEvent(event, 'left-handle');
    this._startWidth = this._width;
  }

  /** handle mousedown on the right handle */
  _handleRightHandleMouseDown(event: MouseEvent): void {
    this._handleBoxEvent(event, 'right-handle');
    this._startWidth = this._width;
  }

  /** handle mousedown on the area */
  _handleBoxMouseDown(event: MouseEvent): void {
    this._handleBoxEvent(event, 'box');
    this._offsetX = this._calculateRelativeXPosToArea(event);
    addCssClass(this._origin, 'dt-grabbing');
  }

  _handleClose(event: MouseEvent): void {
    event.preventDefault();
    this._reset();
    this.closed.next();
    this.closed.complete();
  }

  private _handleBoxEvent(event: MouseEvent, target: DtSelectionAreaEventTarget): void {
    event.preventDefault();
    event.stopPropagation();
    this._touching = true;
    this._applyPointerEvents(true);
    this._eventTarget = target;
    this._attachWindowEventListeners();
    this._startX = this._calculateRelativeXPos(event);
    this._update();
  }

  private _update(): void {
    requestAnimationFrame(() => {
      if (!this._touching) {
        return;
      }
      this._applySizeAndPosition();
      const left = this._left !== null ? this._left : this._boundaries.width - this._right! - this._width;
      const right = this._right !== null ? this._right : this._boundaries.width - this._left! - this._width;
      this.changed.emit({
        left,
        right,
        width: this._width,
        source: this,
      });
      this._update();
    });
  }

  private _applySizeAndPosition(): void {
    this._box.nativeElement.style.width = `${this._width}px`;
    if (this._left !== null) {
      this._box.nativeElement.style.left = `${this._left}px`;
      this._box.nativeElement.style.right = '';
    } else {
      this._box.nativeElement.style.left = '';
      this._box.nativeElement.style.right = `${this._right}px`;
    }
    this._overlay.overlayRef.updatePosition();
  }

  private _applyPointerEvents(touching: boolean): void {
    if (touching) {
      addCssClass(this._box.nativeElement, DT_NO_INTERACTION_CSS_CLASS);
    } else {
      removeCssClass(this._box.nativeElement, DT_NO_INTERACTION_CSS_CLASS);
    }
  }

  private _applyBoundaries(origin: HTMLElement | null): void {
    /**
     * This needs to be run after zone is stable because we need to wait until the origin is actually rendered
     * to get the correct boundaries
     */
    if (origin) {
      this._zone.onStable.pipe(take(1)).subscribe(() => {
        this._boundaries = origin.getBoundingClientRect();
        this._ref.nativeElement.style.left = `${this._boundaries.left}px`;
        this._ref.nativeElement.style.top = `${this._boundaries.top}px`;
        this._ref.nativeElement.style.width = `${this._boundaries.width}px`;
        this._ref.nativeElement.style.height = `${this._boundaries.height}px`;
      });
    }
  }

  private _calculateRelativeXPos(ev: MouseEvent): number {
    return ev.clientX - this._boundaries.left;
  }

  private _calculateRelativeXPosToArea(ev: MouseEvent): number {
    const targetBoundingClientRect = this._box.nativeElement.getBoundingClientRect();
    return ev.clientX - targetBoundingClientRect.left;
  }

  private _reset(): void {
    this._box.nativeElement.style.width = '0px';
    removeCssClass(this._box.nativeElement, DT_NO_INTERACTION_CSS_CLASS);
    this._width = 0;
    this._left = null;
    this._isBoxVisible = false;
    this._applyBoundaries(this._origin);
    this._changeDetectorRef.markForCheck();
  }

}
