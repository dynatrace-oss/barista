import { Directive, Input, ElementRef } from '@angular/core';
import { DtOverlayService } from './overlay';
import { DtOverlayConfig } from './overlay-config';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay';
import { DtOverlayContainer } from './overlay-container';

@Directive({
  selector: '[dtOverlayTrigger]',
  exportAs: 'dtOverlayTrigger',
  host: {
    '(mouseenter)': 'overlayRef && dtOverlayService.openHover()',
    '(mouseleave)': 'overlayRef && dtOverlayService.closeHover()',
    '(click)': 'overlayRef && dtOverlayService.stay(true, this)',
  }
})
export class DtOverlayTrigger extends CdkOverlayOrigin {

  @Input('dtOverlayTrigger')
  set overlayId(value: DtOverlayContainer) {
    value.registerTrigger(this);
  }
  @Input() dtOverlayConfig: DtOverlayConfig;

  constructor(public dtOverlayService: DtOverlayService, elementRef: ElementRef) {
    super(elementRef);
  }

  public overlayRef: OverlayRef = this.dtOverlayService.create(this, this.dtOverlayConfig);
}
