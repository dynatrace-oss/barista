import { Directive, Input, ElementRef, OnDestroy, TemplateRef, Renderer2, ViewChild, ChangeDetectorRef, DoCheck, NgZone } from '@angular/core';
import { DtOverlayService, DEFAULT_DT_OVERLAY_CONFIG } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import { DtOverlayRef } from './overlay-ref';
// import { GlobalPositionStrategy } from '@angular/cdk/overlay';

// '(mousemove)': '_handleMouseMove($event)',
// '(mousemove)': '_handleMouseMove($event)',

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': '_handleMouseEnter($event)',
    '(mouseleave)': '_handleMouseLeave()',
    // '(mousemove)': '_handleMouseMove($event)',
    '(click)': '_handleClick()',
  },
  // providers: [
  //   GlobalPositionStrategy,
  // ]
})
export class DtOverlayTrigger<T> implements DoCheck {

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
    this._config = { ...DEFAULT_DT_OVERLAY_CONFIG, ...value };
  }

  constructor(
    protected dtOverlayService: DtOverlayService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    public elementRef: ElementRef
  ) {
  }

  ngDoCheck(): void {
    console.log('change detection triggered');
  }

  _handleMouseEnter(event: MouseEvent): void {

    this.dtOverlayService.create<T>(this.elementRef, this._content, 'global', '', this.dtOverlayConfig);
    if (this.dtOverlayConfig.enableMouseMove) {
      this._ngZone.runOutsideAngular(() => {
        this.elementRef.nativeElement.addEventListener('mousemove', this._handleMouseMove.bind(this));
      });
    }
  }

  _handleMouseLeave(): void {
    const ref = this.dtOverlayService.overlayRef;
    if (this.dtOverlayConfig.enableMouseMove && ref && !ref.pinned) {
      this.dtOverlayService.close();
    }
    this.elementRef.nativeElement.removeEventListener('mousemove', this._handleMouseMove);
  }

  // using "HTMLElement" type as MouseEvent interface doesn't have the target property
  _handleMouseMove(event: MouseEvent): void {
    console.log('mouse move', event);

    if (this.dtOverlayService.overlayRef) {

      this.dtOverlayService.overlayRef.overlayRef.overlayElement.style.transform =
        `translate(${event.offsetX}px, ${event.offsetY}px)`;
    }
  }

  _handleClick(): void {
    console.log('handle click');
    if (this.dtOverlayConfig.enableClick) {
      // const dtOverlayRef: DtOverlayRef = this.dtOverlayService.overlayRef === undefined ?
      // this.dtOverlayService.create<T>(
      //  this.elementRef, this._content, 'flexible', 'reposition', this.dtOverlayConfig) : this.dtOverlayService.overlayRef;

        this.dtOverlayService.close();

        const dtOverlayRef: DtOverlayRef = this.dtOverlayService.create<T>(
          this.elementRef, this._content, 'flexible', 'close', this.dtOverlayConfig);

        dtOverlayRef.overlayRef.backdropClick().subscribe(() => {
          this.dtOverlayService.close();
          dtOverlayRef.pin(false);
        });

        dtOverlayRef.overlayRef.keydownEvents()
          .pipe(filter((event) => event.keyCode === ESCAPE && dtOverlayRef.pinned))
          .subscribe(() => {
            this.dtOverlayService.close();
          });

        this.dtOverlayService.trapFocus();
        this.elementRef.nativeElement.focus();
        this.dtOverlayService.setFocus();

        dtOverlayRef.pin(true);

        this._changeDetectorRef.markForCheck();
    }
  }
}
