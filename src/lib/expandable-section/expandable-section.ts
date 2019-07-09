import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import { DtExpandablePanel } from '@dynatrace/angular-components/expandable-panel';
import { CanDisable } from '@dynatrace/angular-components/core';
import { Observable, defer } from 'rxjs';
import { take, switchMap, filter } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  exportAs: 'dtExpandableSectionHeader',
  selector: 'dt-expandable-section-header',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSectionHeader {}

@Component({
  moduleId: module.id,
  selector: 'dt-expandable-section',
  exportAs: 'dtExpandableSection',
  templateUrl: 'expandable-section.html',
  styleUrls: ['expandable-section.scss'],
  host: {
    class: 'dt-expandable-section',
    '[class.dt-expandable-section-opened]': 'expanded',
    '[class.dt-expandable-section-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtExpandableSection implements CanDisable {
  /** Whether the expandable section is expanded. */
  @Input()
  get expanded(): boolean {
    return this._panel.expanded;
  }
  set expanded(value: boolean) {
    this._panel.expanded = value;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Whether the expandable is open (expanded).
   * @deprecated Use expanded instead.
   * @breaking-change To be removed with 5.0.0
   */
  @Input()
  get opened(): boolean {
    return this.expanded;
  }
  set opened(value: boolean) {
    this.expanded = value;
  }

  /** Whether the expandable section is disabled. */
  @Input()
  get disabled(): boolean {
    return this._panel && this._panel.disabled;
  }
  set disabled(value: boolean) {
    this._panel.disabled = value;
    this._changeDetectorRef.markForCheck();
  }

  /** Event emitted when the section's expandable state changes. */
  @Output() readonly expandChange: Observable<boolean> = defer(() => {
    if (this._panel) {
      return this._panel.expandChange.asObservable();
    }

    return this._ngZone.onStable.asObservable().pipe(
      take(1),
      switchMap(() => this.expandChange)
    );
  });
  /** Event emitted when the section is expanded. */
  @Output('expanded') readonly _sectionExpanded = this.expandChange.pipe(
    filter(v => v)
  );
  /** Event emitted when the section is collapsed. */
  @Output('collapsed') readonly _sectionCollapsed = this.expandChange.pipe(
    filter(v => !v)
  );

  /**
   * Emits when the expandable opens or closes
   * @deprecated Use expandChange instead.
   * @breaking-change To be removed with 5.0.0.
   */
  @Output() readonly openedChange = this.expandChange;

  @ViewChild(DtExpandablePanel, { static: true })
  private _panel: DtExpandablePanel;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone
  ) {}

  /**
   * Toggles the expanded state of the panel.
   * @breaking-change Remove return type with 5.0.0. Use void instead of boolean.
   */
  toggle(): boolean {
    this._panel.toggle();
    this._changeDetectorRef.markForCheck();
    return this.expanded;
  }

  /** Sets the expanded state of the panel to false. */
  close(): void {
    this._panel.close();
    this._changeDetectorRef.markForCheck();
  }

  /** Sets the expanded state of the panel to true. */
  open(): void {
    this._panel.open();
    this._changeDetectorRef.markForCheck();
  }
}
