import {
  Component,
  Directive,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef,
  ElementRef,
  OnDestroy,
  NgZone,
  AfterContentInit,
} from '@angular/core';
import {
  DtOverlay,
  DtOverlayTrigger,
} from '@dynatrace/angular-components/overlay';
import { FocusMonitor } from '@angular/cdk/a11y';

@Directive({
  selector: 'dt-legend-symbol, [dtLegendSymbol]',
  host: {
    class: 'dt-legend-symbol',
  },
})
export class DtLegendSymbol {}

@Directive({
  selector: 'ng-template[dtLegendOverlay]',
})
export class DtLegendOverlay {}

@Component({
  selector: 'dt-legend-item',
  templateUrl: 'legend-item.html',
  styleUrls: ['legend-item.scss'],
  host: {
    class: 'dt-legend-item',
    '(mouseover)': 'hasOverlay && _onMouseOver($event)',
    '(mouseout)': 'hasOverlay && _onMouseOut($event)',
    '(keydown)': 'hasOverlay && _handleKeydown($event)',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtLegendItem extends DtOverlayTrigger<{}>
  implements AfterContentInit, OnDestroy {
  @ContentChild(DtLegendOverlay, { read: TemplateRef, static: true })
  _overlayTemplateRef: TemplateRef<{}>;

  get hasOverlay(): boolean {
    return !!this._overlayTemplateRef;
  }

  constructor(
    overlay: DtOverlay,
    elementRef: ElementRef,
    zone: NgZone,
    focusMonitor: FocusMonitor
  ) {
    super(elementRef, overlay, zone, focusMonitor, '0');
  }

  ngAfterContentInit(): void {
    if (this._overlayTemplateRef) {
      this.overlay = this._overlayTemplateRef;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
