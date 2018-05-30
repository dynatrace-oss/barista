import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, HostListener, Output, EventEmitter, Directive, ContentChild,
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';

@Directive({
  selector: `dt-show-less-label`,
})
export class DtShowLessLabel { }

@Component({
  moduleId: module.id,
  selector: 'dt-show-more',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    'class': 'dt-show-more',
    '[attr.tabindex]': '0',
    '[class.dt-show-more-show-less]': 'showLess',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore {

  @Output() readonly changed = new EventEmitter<boolean>();

  @ContentChild(DtShowLessLabel)
  _lessLabel: DtShowLessLabel;

  private _showLess: boolean;

  @Input()
  get showLess(): boolean {
    return this._showLess || false;
  }

  set showLess(value: boolean) {
    this._showLess = value;
  }

  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
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
    this.changed.emit(!this.showLess);
  }
}
