import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CanDisable, mixinDisabled } from '@dynatrace/angular-components/core';

export class DtShowMoreBase {}
const _DtShowMoreMixinBase = mixinDisabled(DtShowMoreBase);
@Component({
  moduleId: module.id,
  selector: 'button[dt-show-more]',
  exportAs: 'dtShowMore',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    class: 'dt-show-more',
    '[class.dt-show-more-disabled]': 'disabled',
    '[class.dt-show-more-show-less]': 'showLess',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-label]': '_ariaLabel',
  },
  inputs: ['disabled'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore extends _DtShowMoreMixinBase
  implements CanDisable, OnDestroy {
  /** Sets the component's show less state when used as an expandable panel trigger. */
  @Input()
  get showLess(): boolean {
    return this._showLess;
  }
  set showLess(value: boolean) {
    this._showLess = coerceBooleanProperty(value);
  }
  private _showLess = false;

  /** Aria label for the show less state. */
  @Input('aria-label-show-less')
  get ariaLabelShowLess(): string {
    return this._ariaLabelShowLess;
  }
  set ariaLabelShowLess(value: string) {
    this._ariaLabelShowLess = value;
  }
  private _ariaLabelShowLess = 'Show less';

  /** @internal Aria label for show less state without button text. */
  get _ariaLabel(): string | null {
    return this._showLess && this._ariaLabelShowLess
      ? this._ariaLabelShowLess
      : null;
  }

  constructor(
    private _elementRef: ElementRef,
    private _focusMonitor: FocusMonitor,
  ) {
    super();
    this._focusMonitor.monitor(this._elementRef.nativeElement, true);
  }

  ngOnDestroy(): void {
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }
}
