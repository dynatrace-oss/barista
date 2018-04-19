import {DOWN_ARROW, ENTER, SPACE, UP_ARROW} from '@angular/cdk/keycodes';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ChangeDetectorRef, Directive, HostBinding, HostListener, Input} from '@angular/core';
import {DtExpandablePanel} from './expandable-panel';
import {CanDisable} from '@dynatrace/angular-components/core';

@Directive({
  selector: '[dtExpandablePanel]',
  exportAs: 'dtExpandableTrigger',
  host: {
    '[tabindex]': 'disabled ? -1 : 0',
    'class': 'dt-expandable-panel-trigger',
  },
})
export class DtExpandablePanelTrigger implements CanDisable {

  private _expandable: DtExpandablePanel;
  private _disabled = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  set dtExpandablePanel(value: DtExpandablePanel) {
    this._expandable = value;
    this._expandable.openedChange.subscribe((opened) => {
      this._changeDetectorRef.markForCheck();
    });
  }

  @Input()
  @HostBinding('class.dt-expandable-panel-trigger-open')
  get opened(): boolean {
    return this._expandable.opened;
  }
  set opened(value: boolean) {
    this._expandable.opened = value;
  }

  @Input()
  @HostBinding('attr.aria-disabled')
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }

  @HostListener('click', ['$event'])
  // tslint:disable-next-line:no-unused-variable
  private _onClick(event: MouseEvent): void {
    if (this._expandable) {
      this._expandable.toggle();
    }
    event.preventDefault();
  }

  @HostListener('keydown', ['$event'])
  // tslint:disable-next-line:no-unused-variable
  private _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isAltKey = event.altKey;
    if (keyCode === ENTER || keyCode === SPACE) {
      this._expandable.toggle();
      event.preventDefault();
    } else if (isAltKey && keyCode === DOWN_ARROW) {
      this._expandable.open();
      event.preventDefault();
    } else if (isAltKey && keyCode === UP_ARROW) {
      this._expandable.close();
      event.preventDefault();
    }
  }
}
