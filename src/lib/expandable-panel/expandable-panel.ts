import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'dt-expandable-panel',
  exportAs: 'dtExpandablePanel',
  templateUrl: 'expandable-panel.html',
  styleUrls: ['expandable-panel.scss'],
  host: {
    class: 'dt-expandable-panel',
    '[class.dt-expandable-panel-opened]': 'expanded',
    '[attr.aria-disabled]': 'disabled',
  },
  animations: [
    trigger('animationState', [
      state(
        'false',
        style({
          height: '0px',
          visibility: 'hidden',
        }),
      ),
      state(
        'true',
        style({
          height: '*',
          visibility: 'visible',
          overflow: 'visible',
        }),
      ),
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
  /** Whether the panel is expanded. */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    // Only update expanded state if it actually changed.
    if (this._expanded !== newValue) {
      this._expanded = newValue;
      this.expandChange.emit(newValue);

      // Ensures that the animation will run when the value is set outside of an `@Input`.
      // This includes cases like the open, close and toggle methods.
      this._changeDetectorRef.markForCheck();
    }
  }
  private _expanded = false;

  /** Whether the panel is disabled. */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    // When panel gets disabled it will also close when expanded.
    if (this._disabled && this._expanded) {
      this._expanded = false;
    }
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /**
   * @deprecated Will be removed, use expanded instead
   * @breaking-change To be removed with 5.0.0
   */
  @Input()
  get opened(): boolean {
    return this.expanded;
  }
  set opened(value: boolean) {
    this.expanded = value;
  }

  /** Event emitted when the panel's expandable state changes. */
  @Output() readonly expandChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  /** @internal Event emitted when the panel is expanded. */
  @Output('expanded') readonly _panelExpanded = this.expandChange.pipe(
    filter(v => v),
  );

  /**  @internal Event emitted when the panel is collapsed. */
  @Output('collapsed') readonly _panelCollapsed = this.expandChange.pipe(
    filter(v => !v),
  );
  /**
   * Event emitted when the panel has been opened.
   * @deprecated Use expandChange instead.
   * @breaking-change To be removed with 5.0.0
   */
  @Output() readonly openedChange = this.expandChange;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   * Toggles the expanded state of the panel.
   * @breaking-change Remove return type with 5.0.0. Use void instead of boolean.
   */
  toggle(): boolean {
    if (!this._disabled) {
      this.expanded = !this.expanded;
    }
    return this.expanded;
  }

  /** Sets the expanded state of the panel to false. */
  close(): void {
    if (!this._disabled) {
      this.expanded = false;
    }
  }

  /** Sets the expanded state of the panel to true. */
  open(): void {
    if (!this._disabled) {
      this.expanded = true;
    }
  }
}
