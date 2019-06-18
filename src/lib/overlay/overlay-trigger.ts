import { Directive, Input, ElementRef, TemplateRef, NgZone, Attribute } from '@angular/core';
import { DtOverlay } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { DtOverlayRef } from './overlay-ref';
import { Subscription, fromEvent } from 'rxjs';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { FocusMonitor } from '@angular/cdk/a11y';
import { mixinTabIndex, HasTabIndex, mixinDisabled, CanDisable, readKeyCode } from '@dynatrace/angular-components/core';
import { take } from 'rxjs/operators';

export class DtOverlayTriggerBase { }
export const _DtOverlayTriggerMixin = mixinTabIndex(mixinDisabled(DtOverlayTriggerBase));

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseover)': '_onMouseOver($event)',
    '(mouseout)': '_onMouseOut($event)',
    '(keydown)': '_handleKeydown($event)',
    '(click)': '_handleClick()',
    'class': 'dt-overlay-trigger',
    '[attr.tabindex]': 'tabIndex',
  },
  inputs: ['disabled', 'tabIndex'],
})
export class DtOverlayTrigger<T> extends _DtOverlayTriggerMixin implements CanDisable, HasTabIndex {
  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = new DtOverlayConfig();
  private _dtOverlayRef: DtOverlayRef<T> | null = null;
  private _moveSub = Subscription.EMPTY;

  /** Overlay pane containing the content */
  @Input('dtOverlay')
  set overlay(value: TemplateRef<T>) {
    this._content = value;
  }

  @Input()
  get dtOverlayConfig(): DtOverlayConfig { return this._config; }
  set dtOverlayConfig(value: DtOverlayConfig) {
    this._config = value;
  }

  constructor(
    private elementRef: ElementRef,
    private _dtOverlayService: DtOverlay,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string
  ) {
    super();
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /** Focuses the trigger. */
  focus(): void {
    this._focusMonitor.focusVia(this.elementRef.nativeElement, 'keyboard');
  }

  _onMouseOver(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      this._moveSub.unsubscribe();
      this._moveSub = this._ngZone.runOutsideAngular(() => fromEvent(this.elementRef.nativeElement, 'mousemove')
        .subscribe((ev: MouseEvent) => {
          this._onMouseMove(ev);
        }));
    }
  }

  _onMouseOut(event: MouseEvent): void {
    event.stopPropagation();
    this._moveSub.unsubscribe();
    const ref = this._dtOverlayService.overlayRef;
    if (ref && !ref.pinned) {
      this._dtOverlayService.dismiss();
    }
  }

  _onMouseMove(event: MouseEvent): void {
    if (this._dtOverlayRef === null) {
      this._ngZone.run(() => { this._createOverlay(); });
    }
    if (this._dtOverlayRef && !this._dtOverlayRef.pinned) {
      this._dtOverlayRef.updatePosition(event.offsetX, event.offsetY);
    }
  }

  _handleClick(): void {
    if (!this.disabled && this._config.pinnable && this._dtOverlayRef) {
      this._dtOverlayRef.pin(true);
    }
  }

  /** Ensures the trigger is selected when activated from the keyboard. */
  _handleKeydown(event: KeyboardEvent): void {
    if (!this.disabled) {
      const keyCode = readKeyCode(event);
      if (keyCode === ENTER || keyCode === SPACE) {
        event.preventDefault();
        this._createOverlay();
        this._dtOverlayRef!.pin(true);
      }
    }
  }

  private _createOverlay(): void {
    const ref = this._dtOverlayService.create<T>(this.elementRef, this._content, this._config);
    ref.afterExit().pipe(take(1)).subscribe(() => {
      this._dtOverlayRef = null;
    });
    this._dtOverlayRef = ref;
  }
}
