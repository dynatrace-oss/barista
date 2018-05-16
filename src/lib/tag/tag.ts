import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, HostBinding, Directive, Output, EventEmitter, Input,
} from '@angular/core';

import {
  CanDisable,
  mixinDisabled,
} from '../core/index';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

export class DtTagBase {
}

export const _DtTag =
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
    '[attr.tabindex]': 'interactive ? 1 : -1',
    '[class.dt-tag-disabled]': 'disabled',
  },
  inputs: ['disabled'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTag<T> extends _DtTag implements CanDisable {

  @Input()
  value: T | undefined;

  @Output()
  readonly removed: EventEmitter<T> = new EventEmitter<T>();

  private _removable = false;
  private _interactive = false;

  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    this._removable = newValue;
  }

  /** Whether the button-group item is selected. */
  @Input()
  @HostBinding('class.dt-tag-interactive')
  get interactive(): boolean {
    return this._interactive && !this.disabled;
  }
  set interactive(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    this._interactive = newValue;
  }

  _doDelete(): void {
    this.removed.emit(this.value);
  }
}
