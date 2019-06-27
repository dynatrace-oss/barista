import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DELETE } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

import { readKeyCode } from '@dynatrace/angular-components/core';

export class DtTagBase {}

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
    '[attr.role]': `'option'`,
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.tabindex]': 'removable && !disabled ? 0 : -1',
    '[class.dt-tag-disabled]': 'disabled',
    '[class.dt-tag-removable]': 'removable && !disabled',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTag<T> extends DtTagBase {
  @Input()
  value?: T;

  /** @deprecated Disabled state will be removed without replacement in 4.0 */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: boolean) {
    this._removable = coerceBooleanProperty(value);
  }

  @Output()
  readonly removed: EventEmitter<T> = new EventEmitter<T>();

  private _removable = false;
  private _disabled = false;

  @HostListener('keyup', ['$event'])
  _doDelete(event?: KeyboardEvent): void {
    if (
      !this.disabled &&
      (event === undefined || readKeyCode(event) === DELETE)
    ) {
      this.removed.emit(this.value);
    }
  }
}
