import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

/**
 * @deprecated There is no show less label needed according to UX guidelines.
 * @breaking-change Will be removed with 5.0.0.
 */
@Directive({
  selector: 'dt-show-less-label',
  exportAs: 'dtShowLessLabel',
})
export class DtShowLessLabel {}

@Component({
  moduleId: module.id,
  /**
   * @deprecated The selector will be updated to button[dt-show-more] in 5.0.0
   * @breaking-change update selector to button[dt-show-more] in 5.0.0, update template accordingly
   */
  selector: 'dt-show-more',
  exportAs: 'dtShowMore',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    class: 'dt-show-more',
    '[class.dt-show-more-disabled]': 'disabled',
    '[class.dt-show-more-show-less]': 'showLess',
    '(click)': '_fireChange()',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore {
  /** Whether the show-more is disabled. Not focus and clickable anymore */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /**
   * @deprecated To be removed once the selector is updated to button[dt-show-more].
   * Use the button's native click event instead.
   * @breaking-change Remove with 5.0.0
   * Emits when the show more element was clicked
   */
  @Output() readonly changed = new EventEmitter<void>();

  /** @internal */
  // tslint:disable-next-line: deprecation
  @ContentChild(DtShowLessLabel, { static: true }) _lessLabel: DtShowLessLabel;

  /** Whether the show less label is visible. */
  @Input()
  get showLess(): boolean {
    return this._showLess;
  }
  set showLess(value: boolean) {
    this._showLess = coerceBooleanProperty(value);
  }
  private _showLess = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal emits the change */
  _fireChange(): void {
    if (!this._disabled) {
      // tslint:disable-next-line: deprecation
      this.changed.emit();
    }
  }
}
