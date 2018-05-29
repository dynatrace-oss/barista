import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, HostListener, Output, EventEmitter,
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';

@Component({
  moduleId: module.id,
  selector: 'dt-show-more',
  templateUrl: 'show-more.html',
  styleUrls: ['show-more.scss'],
  host: {
    'class': 'dt-show-more',
    '[attr.tabindex]': '0',
    '[class.dt-show-more-show-less]': '!_showMore',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtShowMore {

  @Output() readonly changed = new EventEmitter<boolean>();

  private _showMore = true;

  @Input()
  get showMore(): boolean {
    return this._showMore;
  }

  set showMore(value: boolean) {
    this._showMore = value;
  }

  @HostListener('keydown', ['$event'])
  // tslint:disable-next-line:no-unused-variable
  private _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  // tslint:disable-next-line:no-unused-variable
  private _handleKeyup(event: KeyboardEvent): void {
    if (event.keyCode === ENTER || event.keyCode === SPACE) {
      this._fireChange();
    }
  }

  @HostListener('click')
  // tslint:disable-next-line:no-unused-variable
  private _handleClick(): void {
    this._fireChange();
  }

  private _fireChange(): void {
    this.changed.emit(this.showMore);
  }
}
