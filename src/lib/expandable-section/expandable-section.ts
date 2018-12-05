import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output, ViewChild,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import {DtExpandablePanel} from '@dynatrace/angular-components/expandable-panel';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import { CanDisable } from '@dynatrace/angular-components/core';
import { Observable, defer } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

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
    'class': 'dt-expandable-section',
    '[class.dt-expandable-section-opened]': 'opened',
    '[class.dt-expandable-section-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection implements CanDisable {

  /** Whether the expandable is open (expanded). */
  @Input()
  get opened(): boolean { return this._panel.opened && !this.disabled; }
  set opened(value: boolean) { this._panel.opened = coerceBooleanProperty(value); }

  /** Whether the expandable is disabled. When set to false it will also close. */
  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    if (this._disabled) {
      this._panel.close();
    }
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /** Emits when the expandable opens or closes  */
  @Output() readonly openedChange: Observable<boolean> = defer(() => {
    if (this._panel) {
      return this._panel.openedChange.asObservable();
    }

    return this._ngZone.onStable
      .asObservable()
      .pipe(take(1), switchMap(() => this.openedChange));
  });

  @ViewChild(DtExpandablePanel)
  private _panel: DtExpandablePanel;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _ngZone: NgZone) { }

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
