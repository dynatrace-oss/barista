import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Directive, Output, EventEmitter, Input, HostListener,
} from '@angular/core';

import {
  CanDisable,
  mixinDisabled,
  readKeyCode,
} from '@dynatrace/angular-components/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DELETE } from '@angular/cdk/keycodes';

export class DtTagBase { }

export const _DtTagMixinBase =
  mixinDisabled(DtTagBase);

/** Key of a tag, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-tag-key`,
  host: {
    class: 'tag-key',
  },
})
export class DtTagKey { }

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
  inputs: ['disabled'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTag<T> extends _DtTagMixinBase implements CanDisable {

  @Input()
  value: T | undefined;

  @Output()
  readonly removed: EventEmitter<T> = new EventEmitter<T>();

  private _removable = false;

  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    this._removable = newValue;
  }

  @HostListener('keyup', ['$event'])
  _doDelete(event?: KeyboardEvent): void {
    if (!this.disabled && (event === undefined || readKeyCode(event) === DELETE)) {
      this.removed.emit(this.value);
    }
  }
}
