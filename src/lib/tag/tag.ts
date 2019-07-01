import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

/** Key of a tag, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tag-key`,
  host: {
    class: 'tag-key',
  },
})
export class DtTagKey {}

@Component({
  moduleId: module.id,
  selector: 'dt-tag, [dt-tag], [dtTag]',
  templateUrl: 'tag.html',
  styleUrls: ['tag.scss'],
  host: {
    'class': 'dt-tag',
    'role': 'option',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[class.dt-tag-disabled]': 'disabled',
    '[class.dt-tag-removable]': 'removable && !disabled',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTag<T> {
  @Input() value?: T;

  /**
   * @deprecated Disabled property on tags has no longer any use.
   * @breaking-change Disabled property will be removed in version 5.0.0
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: boolean) {
    this._removable = coerceBooleanProperty(value);
  }
  private _removable = false;

  @Output()
  readonly removed: EventEmitter<T> = new EventEmitter<T>();

  _removeTag(): void {
    if (!this._disabled) {
      this.removed.emit(this.value);
    }
  }
}
