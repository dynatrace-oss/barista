import {
  Directive,
  Input,
  OnInit,
} from '@angular/core';
import { DtOverlay } from './overlay';
import { DtOverlayConfigInterface } from './overlay-config-model'
import {CdkOverlayOrigin} from '@angular/cdk/overlay';

@Directive({
  selector: '[dtOverlayConfig]',
  exportAs: 'dtOverlayConfig',
})
export class DtOverlayConfig implements OnInit {

  private _overlay: DtOverlay;
  private _config: DtOverlayConfigInterface;

  @Input('dtOverlayConfig')
  set config(value: DtOverlayConfigInterface) {
    this._config = value;
  }

  constructor(elementRef: DtOverlay) {
    this._overlay = elementRef;
  }

  ngOnInit() {
    this._overlay.setConfig(this._config);
  }
}
