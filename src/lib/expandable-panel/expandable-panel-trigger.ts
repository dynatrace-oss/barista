import { DOWN_ARROW, ENTER, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  HostBinding,
  HostListener,
  Input, OnDestroy
} from '@angular/core';
import { DtExpandablePanel } from './expandable-panel';
import { CanDisable, readKeyCode } from '@dynatrace/angular-components/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[dtExpandablePanel]',
  exportAs: 'dtExpandablePanelTrigger',
  host: {
    '[tabindex]': 'disabled ? -1 : 0',
    'role': 'button',
    'class': 'dt-expandable-panel-trigger',
  },
})
export class DtExpandablePanelTrigger implements CanDisable, AfterContentInit, OnDestroy {

  private _expandable: DtExpandablePanel;
  private _disabled = false;
  private _subscription: Subscription;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  @Input()
  set dtExpandablePanel(value: DtExpandablePanel) {
    this._expandable = value;
  }

  ngAfterContentInit(): void {
    this._subscription = this._expandable.openedChange.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
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
  _onClick(event: MouseEvent): void {
    if (this._expandable) {
      this._expandable.toggle();
    }
    event.preventDefault();
  }

  @HostListener('keydown', ['$event'])
  _handleKeydown(event: KeyboardEvent): void {
    const keyCode = readKeyCode(event);
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
