import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  moduleId: module.id,
  selector: 'dt-expandable-panel',
  exportAs: 'dtExpandablePanel',
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
      })),
      state('true', style({
        height: '*',
        visibility: 'visible',
        overflow: 'visible',
      })),
      transition('true <=> false', [
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)'),
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
  set opened(value: boolean) { this._openClose(coerceBooleanProperty(value)); }

  /** Event emitted when the select has been opened. */
  @Output() readonly openedChange = new EventEmitter<boolean>();

  private _opened = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  toggle(): boolean {
    this._openClose(!this._opened);
    return this.opened;
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
