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

/**
 * Provides basic expand/collaps functionality for
 * inline-text without any styling.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-expandable-text',
  exportAs: 'dtExpandableText',
  templateUrl: 'expandable-text.html',
  styleUrls: ['expandable-text.scss'],
  host: {
    class: 'dt-expandable-text',
    '[class.dt-expandable-text-expanded]': 'expanded',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtExpandableText {
  /** Label for the expand button */
  @Input() label: string;
  /** Label for the collapse button */
  @Input() labelClose: string;

  /** Whether the text is expanded */
  @Input()
  get expanded(): boolean {
    return this._expanded;
  }
  set expanded(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (this._expanded !== newValue) {
      this._expanded = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }

  private _expanded = false;

  /** Event emitted when state changes */
  @Output() readonly expandChanged = new EventEmitter<boolean>();

  /** @internal Event emitted when text is expanded */
  // tslint:disable-next-line: dt-annotate-internal-fields
  @Output('expanded') readonly _textExpanded = this.expandChanged.pipe(
    filter(v => v),
  );

  /** @internal Event emitted when text is collapsed */
  // tslint:disable-next-line: dt-annotate-internal-fields
  @Output('collapsed') readonly _textCollapsed = this.expandChanged.pipe(
    filter(v => !v),
  );

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /** Toggles the expandable text state */
  toggle(): void {
    if (this.expanded) {
      this.close();
    } else {
      this.open();
    }
  }

  /** Closes the expandable text */
  close(): void {
    this.expanded = false;
    this.expandChanged.emit(this.expanded);
  }

  /** Opens the expandable text */
  open(): void {
    this.expanded = true;
    this.expandChanged.emit(this.expanded);
  }
}
