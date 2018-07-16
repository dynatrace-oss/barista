import { Directive, Input, ElementRef, OnDestroy, TemplateRef, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DtOverlayService, DEFAULT_DT_OVERLAY_CONFIG } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ESCAPE } from '@angular/cdk/keycodes';
import { filter } from 'rxjs/operators';
import { DtOverlayRef } from './overlay-ref';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';

// '(mousemove)': '_handleMouseMove($event)',
// '(mousemove)': '_handleMouseMove($event)',

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': '_handleMouseEnter($event)',
    '(mouseleave)': '_handleMouseLeave()',
    '(mousemove)': '_handleMouseMove($event)',
    '(click)': '_handleClick()',
  },
  providers: [
    GlobalPositionStrategy,
  ]
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
    this._config = { ...DEFAULT_DT_OVERLAY_CONFIG, ...value };
  }

  constructor(
    protected dtOverlayService: DtOverlayService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _globalPositionStrategy: GlobalPositionStrategy,
    public elementRef: ElementRef) {
  }

  _handleMouseEnter(event: MouseEvent): void {
    // if (this.dtOverlayConfig.enableMouseMove) {
      this._config.posX = event.pageX;
      this._config.posY = event.pageY;

      //TODO: add the strings global, block etc to the dtOvelrayConfig

      this.dtOverlayService.create<T>(this.elementRef, this._content, 'global', '', this.dtOverlayConfig);
      // this._globalPositionStrategy.dispose();

      console.log(this.dtOverlayService.overlayRef)

      this._changeDetectorRef.markForCheck();

    // }
    console.log('mouse enter')
  }

  _handleMouseLeave(): void {
    const ref = this.dtOverlayService.overlayRef;
    if (this.dtOverlayConfig.enableMouseMove && ref && !ref.pinned) {
      this.dtOverlayService.close();
    }
    console.log('mouse leave')
  }

  // using "HTMLElement" type as MouseEvent interface doesn't have the target property
  _handleMouseMove(event: MouseEvent): void {
    console.log('mouse move')
    // const offsetWidth = this.elementRef.nativeElement.offsetWidth;
    // const triggerWidth = Math.floor(offsetWidth / 2);

    console.log(event.pageX, event.pageY);

    this._globalPositionStrategy.left((10 + event.pageX).toString() + 'px');
    this._globalPositionStrategy.top((10 + event.pageY).toString() + 'px');

    if(this.dtOverlayService.overlayRef) {
      this._globalPositionStrategy.dispose();
      this._globalPositionStrategy.attach(this.dtOverlayService.overlayRef.overlayRef);
      this.dtOverlayService.overlayRef.overlayRef.updatePosition();
      this._globalPositionStrategy.apply();
      // console.log(this.dtOverlayService.overlayRef.overlayRef)
    }

    // this.dtOverlayService.overlayRef.overlayRef.updatePosition()

    // this._overlayPane.offsetX = -(triggerWidth - event.offsetX) + 10;
    // this._overlayPane.overlayRef.updatePosition();
    this._changeDetectorRef.markForCheck();
    // this._changeDetectorRef.detectChanges();
  }

  _handleClick(): void {
    console.log('handle click')
    if (this.dtOverlayConfig.enableClick) {
      // const dtOverlayRef: DtOverlayRef = this.dtOverlayService.overlayRef === undefined ?
        // this.dtOverlayService.create<T>(this.elementRef, this._content, 'flexible', 'reposition', this.dtOverlayConfig) : this.dtOverlayService.overlayRef;

        this.dtOverlayService.close();

        const dtOverlayRef: DtOverlayRef = this.dtOverlayService.create<T>(this.elementRef, this._content, 'flexible', 'close', this.dtOverlayConfig)

        dtOverlayRef.overlayRef.backdropClick().subscribe(() => {
          this.dtOverlayService.close();
          dtOverlayRef.pin(false);
        });

        dtOverlayRef.overlayRef.keydownEvents()
          .pipe(filter(event => event.keyCode === ESCAPE && dtOverlayRef.pinned))
          .subscribe(() => {
            this.dtOverlayService.close()
          });

        this.dtOverlayService.trapFocus();
        this.elementRef.nativeElement.focus();
        this.dtOverlayService.setFocus();

        dtOverlayRef.pin(true);

        this._changeDetectorRef.markForCheck();
    }
  }
}
