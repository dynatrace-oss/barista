import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output, ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {DtExpandablePanel} from '@dynatrace/angular-components/expandable-panel';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  moduleId: module.id,
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
  templateUrl: 'expandable-section.html',
  styleUrls: ['expandable-section.scss'],
  host: {
    class: 'dt-expandable-section',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection implements AfterViewInit {

  @ViewChild(DtExpandablePanel)
  private _panel: DtExpandablePanel;

  @Input()
  @HostBinding('class.dt-expandable-panel-opened')
  get opened(): boolean {
    return this._panel.opened;
  }
  set opened(value: boolean) {
    this._panel.opened = coerceBooleanProperty(value);
  }

  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    this._panel.openedChange.subscribe((event: boolean) => {
      this.openedChange.emit(event);
    });
  }

  toggle(): void {
    this._panel.toggle();
  }

  open(): void {
    this._panel.open();
  }

  close(): void {
    this._panel.close();
  }
}
