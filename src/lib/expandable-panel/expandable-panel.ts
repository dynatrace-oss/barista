import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {DOWN_ARROW, ENTER, SPACE, UP_ARROW} from '@angular/cdk/keycodes';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  moduleId: module.id,
  selector: 'dt-expandable-panel',
  templateUrl: 'expandable-panel.html',
  styleUrls: ['expandable-panel.scss'],
  host: {
    class: 'dt-expandable-panel',
  },
  animations: [
    trigger('animationState', [
      state('false', style({
        height: '0px',
        visibility: 'hidden',
        overflow: 'hidden',
      })),
      state('true', style({
        height: '*',
        visibility: 'visible',
      })),
      transition('true <=> false', [
        style({
          overflow: 'hidden',
        }),
        animate('0.4s ease'),
      ]),
    ]),
  ],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandablePanel {

  @Input()
  @HostBinding('class.dt-expandable-panel-opened')
  get opened(): boolean { return this._opened; }
  set opened(value: boolean) { this._opened = coerceBooleanProperty(value); }

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _opened = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  toggle(): void {
    this._openClose(!this._opened);
  }

  open(): void {
    this._openClose(true);
  }

  close(): void {
    this._openClose(false);
  }

  private _openClose(open: boolean): void {
    this._opened = open;
    this.openedChange.emit(open);
    this._changeDetectorRef.detectChanges();
  }
}

@Directive({
  selector: '[dtExpandablePanel]',
  exportAs: 'dtExpandableTrigger',
  host: {
    tabindex: '0',
    class: 'dt-expandable-panel-trigger',
  },
})
export class DtExpandablePanelTrigger {

  private _expandable: DtExpandablePanel;

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
