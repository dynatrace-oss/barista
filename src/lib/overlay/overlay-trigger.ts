import { Directive, Input, ElementRef, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { DtOverlayService, DEFAULT_DT_OVERLAY_CONFIG } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import { DtOverlayRef } from './overlay-ref';

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': '_handleMouseEnter($event)',
    '(mouseleave)': '_handleMouseLeave()',
    '(click)': '_config.enableClick && _handleClick()',
    '(focusout)': '_handleFocusOut()'
  },
})
export class DtOverlayTrigger<T> {

  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = DEFAULT_DT_OVERLAY_CONFIG;

  /** Overlay pane containing the content */
  @ViewChild(CdkConnectedOverlay) _overlayPane: CdkConnectedOverlay;
  @ViewChild(CdkOverlayOrigin) _defaultTrigger: CdkOverlayOrigin;

  @Input('dtOverlay')
  set overlay(value: TemplateRef<T>) {
    this._content = value;
  }

  @Input()
  get dtOverlayConfig(): DtOverlayConfig { return this._config; }
  set dtOverlayConfig(value: DtOverlayConfig) {
    this._config = { ...value };
  }

  /** Event emitted when the select has been opened. */
  @Output() readonly overlayOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    protected _dtOverlayService: DtOverlayService,
    public elementRef: ElementRef
  ) {}

  _handleMouseEnter(): void {
    this._dtOverlayService.create<T>(this.elementRef, this._content, this._config);
    this.overlayOpened.emit(true);
  }

  _handleMouseLeave(): void {
    const ref = this._dtOverlayService.overlayRef;
    if (ref && !ref.pinned) {
      this._dtOverlayService.close();
    }
  }

  _handleClick(): void {
    this._dtOverlayService.close();

    const ref: DtOverlayRef = this._dtOverlayService.create<T>(this.elementRef, this._content, this._config)

    ref.overlayRef.backdropClick().subscribe(() => {
      this.overlayOpened.emit(false);
      ref.pin(false);
    });

    ref.overlayRef.keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && ref.pinned))
      .subscribe(() => {
        this._dtOverlayService.close()
      });

    this._dtOverlayService.trapFocus();
    this.elementRef.nativeElement.focus();
    this._dtOverlayService.setFocus();

    ref.pin(true);
  }

  _handleFocusOut(): void {
    this._dtOverlayService.close();
  }
}
