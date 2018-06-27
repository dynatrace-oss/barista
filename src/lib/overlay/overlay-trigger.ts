import { Directive, Input, ElementRef, OnDestroy, TemplateRef, Renderer2 } from '@angular/core';
import { DtOverlayService, DEFAULT_DT_OVERLAY_CONFIG } from './overlay';
import { DtOverlayConfig } from './overlay-config';

@Directive({
  selector: '[dtOverlay]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': '_handleMouseEnter()',
    '(mouseleave)': '_handleMouseLeave()',
    '(click)': '_handleClick()',
  },
})
export class DtOverlayTrigger<T> {

  private _content: TemplateRef<T>;
  private _config: DtOverlayConfig = DEFAULT_DT_OVERLAY_CONFIG;

  @Input('dtOverlay')
  set overlay(value: TemplateRef<T>) {
    this._content = value;
  }
  @Input()
  get dtOverlayConfig(): DtOverlayConfig { return this._config; }
  set dtOverlayConfig(value: DtOverlayConfig) {
    this._config = { ...DEFAULT_DT_OVERLAY_CONFIG, ...value };
  }

  constructor(protected dtOverlayService: DtOverlayService, public elementRef: ElementRef) {
  }

  _handleMouseEnter(): void {
    if (this.dtOverlayConfig.enableMouseMove) {
      this.dtOverlayService.create<T>(this.elementRef, this._content, this.dtOverlayConfig);
    }
  }

  _handleMouseLeave(): void {
    const ref = this.dtOverlayService.overlayRef;
    if (this.dtOverlayConfig.enableMouseMove && ref && !ref.pinned) {
      this.dtOverlayService.close();
    }
  }

  _handleClick(): void {
    if (this.dtOverlayConfig.enableClick) {
      const overlayRef = this.dtOverlayService.overlayRef === null ?
        this.dtOverlayService.create<T>(this.elementRef, this._content, this.dtOverlayConfig) : this.dtOverlayService.overlayRef;
      overlayRef.pin(true);
    }
  }
}
