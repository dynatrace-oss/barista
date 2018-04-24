import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output, ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {DtExpandablePanel} from '@dynatrace/angular-components/expandable-panel';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { CanDisable } from '@dynatrace/angular-components/core';

@Component({
  moduleId: module.id,
  exportAs: 'dtExpandableSectionHeader',
  selector: 'dt-expandable-section-header',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSectionHeader { }

@Component({
  moduleId: module.id,
  selector: 'dt-expandable-section',
  exportAs: 'dtExpandableSection',
  templateUrl: 'expandable-section.html',
  styleUrls: ['expandable-section.scss'],
  host: {
    class: 'dt-expandable-section',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection implements AfterViewInit, CanDisable {

  private _disabled = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  @ViewChild(DtExpandablePanel)
  private _panel: DtExpandablePanel;

  @Input()
  @HostBinding('class.dt-expandable-section-opened')
  get opened(): boolean {
    return this._panel.opened && !this.disabled;
  }
  set opened(value: boolean) {
    this._panel.opened = coerceBooleanProperty(value);
  }

  @Input()
  @HostBinding('attr.aria-disabled')
  @HostBinding('class.dt-expandable-section-disabled')
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this._panel.close();
    }
    this._changeDetectorRef.markForCheck();
  }

  @Output() readonly openedChange = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    this._panel.openedChange.subscribe((event: boolean) => {
      this.openedChange.emit(event);
    });
  }

  toggle(): boolean {
    if (!this.disabled) {
      this._panel.toggle();
    }
    return this.opened;
  }

  open(): void {
    if (!this.disabled) {
      this._panel.open();
    }
  }

  close(): void {
    this._panel.close();
  }
}
