import { Directive, Input, ElementRef, TemplateRef, ViewChild, DoCheck, NgZone, Optional, Inject } from '@angular/core';
import { DtOverlayService, DEFAULT_DT_OVERLAY_CONFIG } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { DOCUMENT } from '@angular/common';
import { DtOverlayRef } from './overlay-ref';

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseover)': '_onMouseOver($event)',
    '(mouseout)': '_onMouseOut($event)',
    '(click)': '_handleClick()',
  },
})
export class DtOverlayTrigger<T> implements DoCheck {

  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = DEFAULT_DT_OVERLAY_CONFIG;
  private _dtOverlayRef: DtOverlayRef | null = null;

  /** Overlay pane containing the content */

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
    public elementRef: ElementRef,
    protected dtOverlayService: DtOverlayService,
    private _ngZone: NgZone,
    @Optional() @Inject(DOCUMENT) private _document: any,
  ) {}

  _onMouseOver(event: MouseEvent): void {
    event.stopPropagation();

    this._dtOverlayRef = this.dtOverlayService.create<T>(this.elementRef, this._content, this.dtOverlayConfig);
    if (this.dtOverlayConfig.enableMouseMove) {
      this._ngZone.runOutsideAngular(() => {
        this.elementRef.nativeElement.addEventListener('mousemove', this._onMouseMove.bind(this));
      });
    }
  }

  _onMouseOut(event: MouseEvent): void {
    event.stopPropagation();

    const ref = this.dtOverlayService.overlayRef;
    if (ref && !ref.pinned) {
      this.dtOverlayService.close();
    }
    if (this.dtOverlayConfig.enableMouseMove) {
      this.elementRef.nativeElement.removeEventListener('mousemove', this._onMouseMove);
    }
  }

  // using "HTMLElement" type as MouseEvent interface doesn't have the target property
  _onMouseMove(event: MouseEvent): void {
    if (this.dtOverlayService.overlayRef) {
      // check if overlay fits to the right
      // TODO: check the position and add offsets if needed - e.g. originX is set to center substract half the width of the trigger
      const viewportWidth = this._getViewportWidth();
      const overlayBoundingClientRect = this.dtOverlayService.overlayRef.overlayRef.overlayElement.getBoundingClientRect();
      const remainingSpaceToTheRight = viewportWidth - event.pageX - overlayBoundingClientRect.width;
      if (remainingSpaceToTheRight > 0) {
        this.dtOverlayService.overlayRef.overlayRef.overlayElement.style.transform =
        `translate(${event.offsetX}px, 0)`;
    }
      }
  }

  _handleClick(): void {
    if (this.dtOverlayConfig.enableClick && this._dtOverlayRef) {
        // this.dtOverlayService.close();

        // const dtOverlayRef: DtOverlayRef = this.dtOverlayService.create<T>(
        //   this.elementRef, this._content, this.dtOverlayConfig);

        // dtOverlayRef.overlayRef.backdropClick().subscribe(() => {
        //   this.dtOverlayService.close();
        //   dtOverlayRef.pin(false);
        // });

        // dtOverlayRef.overlayRef.keydownEvents()
        //   .pipe(filter((event) => event.keyCode === ESCAPE && dtOverlayRef.pinned))
        //   .subscribe(() => {
        //     this.dtOverlayService.close();
        //   });

        // this.elementRef.nativeElement.focus();

        this._dtOverlayRef.pin(true);

        // this._changeDetectorRef.markForCheck();
    }
  }

  private _getViewportWidth(): number {
    return this._document.documentElement.clientWidth;
  }
}
