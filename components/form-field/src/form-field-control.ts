import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

/** An interface which allows a control to work inside of a `DtFormField`. */
export abstract class DtFormFieldControl<T> {
  /** The value of the control. */
  value: T | null;

  /**
   * Stream that emits whenever the state of the control changes such that the parent `DtFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;

  /** The element ID for this control. */
  readonly id: string;

  /** Gets the NgControl for this control. */
  readonly ngControl: NgControl | null;

  /** Whether the control is focused. */
  readonly focused: boolean;

  /** Whether the control is empty. */
  readonly empty: boolean;

  /** Whether the control is required. */
  readonly required: boolean;

  /** Whether the control is disabled. */
  readonly disabled: boolean;

  /** Whether the control is in an error state. */
  readonly errorState: boolean;

  /** Sets the list of element IDs that currently describe this control. */
  abstract setDescribedByIds(ids: string[]): void;

  /** Handles a click on the control's container. */
  abstract onContainerClick(event: MouseEvent): void;

  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control it is assumed to be false.
   */
  readonly autofilled?: boolean;
}
