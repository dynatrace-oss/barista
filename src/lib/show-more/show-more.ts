import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, HostListener, Output, EventEmitter, Directive, ContentChild,
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {
  CanDisable,
  mixinDisabled, mixinTabIndex
} from '../core/index';
import { HasTabIndex } from '../core/common-behaviours/index';

@Directive({
  selector: `dt-show-less-label`,
})
export class DtShowLessLabel { }

export class DtShowMoreBase {
}
export const _DtShowMore =
  mixinTabIndex(mixinDisabled(DtShowMoreBase));

@Component({
  moduleId: module.id,
  selector: 'dt-show-more',
  exportAs: 'dtShowMore',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  inputs: ['disabled', 'tabIndex'],
  host: {
    'class': 'dt-show-more',
    '[attr.tabindex]': 'tabIndex',
    '[class.dt-show-more-show-less]': 'showLess',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore extends _DtShowMore implements CanDisable, HasTabIndex {

  @Output() readonly changed = new EventEmitter<void>();

  @ContentChild(DtShowLessLabel)
  _lessLabel: DtShowLessLabel;

  private _showLess = false;

  @Input()
  get showLess(): boolean {
    return this._showLess;
  }

  set showLess(value: boolean) {
    this._showLess = coerceBooleanProperty(value);
  }

  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    // The default browser behaviour for SPACE is to scroll the page. We
    // want to prevent this.
    if (event.keyCode === SPACE) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  _handleKeyup(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._fireChange();
    }
  }

  @HostListener('click')
  _handleClick(): void {
    this._fireChange();
  }

  private _fireChange(): void {
    this.changed.emit();
  }
}
