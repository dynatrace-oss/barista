import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  Directive,
  ContentChild,
  ChangeDetectorRef,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
  selector: 'dt-show-less-label',
})
export class DtShowLessLabel { }

@Component({
  moduleId: module.id,
  selector: 'dt-show-more',
  exportAs: 'dtShowMore',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    'class': 'dt-show-more',
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
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /** Emits when the show more element was clicked */
  @Output() readonly changed = new EventEmitter<void>();

  /** @internal */
  @ContentChild(DtShowLessLabel, { static: true }) _lessLabel: DtShowLessLabel;

  @Input()
  get showLess(): boolean { return this._showLess; }
  set showLess(value: boolean) {
    this._showLess = coerceBooleanProperty(value);
  }
  private _showLess = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** @internal emits the change */
  _fireChange(): void {
    this.changed.emit();
  }
}
