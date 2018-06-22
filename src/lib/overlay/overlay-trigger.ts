import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output
} from '@angular/core';
import {DtOverlay} from './overlay';
import {CdkOverlayOrigin} from '@angular/cdk/overlay';

@Directive({
  selector: '[dtOverlayTrigger]',
  exportAs: 'dtOverlayTrigger',
  host: {
    'class': 'dt-overlay-trigger',
    '(mouseenter)': 'overlay && overlay.appear()',
    '(mouseleave)': 'overlay && overlay.closeOnHoverOut()',
    '(mousemove)': 'overlay && overlay.move($event)',
    '(click)': 'overlay && overlay.getConfig().enableClick && overlay.stay()',
  },
})
export class DtOverlayTrigger extends CdkOverlayOrigin implements OnDestroy {

  private _overlay: DtOverlay | undefined;

  @Input('dtOverlayTrigger')
  get overlay(): DtOverlay | undefined { return this._overlay; }
  set overlay(value: DtOverlay | undefined) {
    if (value !== this._overlay) {
      this._unregisterFromOverlay();
      if (value) {
        value.registerTrigger(this);
      }
      this._overlay = value;
    }
  }

  @Output() readonly openChange = new EventEmitter<void>();

  constructor(elementRef: ElementRef) {
    super(elementRef);
  }

  ngOnDestroy(): void {
    this._unregisterFromOverlay();
  }

  _unregisterFromOverlay(): void {
    if (this._overlay) {
      this._overlay.unregisterTrigger(this);
      this._overlay = undefined;
    }
  }
}
