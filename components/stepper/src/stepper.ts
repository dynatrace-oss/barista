import { CdkStepper } from '@angular/cdk/stepper';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  forwardRef,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { DtStep } from './step';
import { DtStepHeader } from './step-header';

@Directive({
  selector: 'dt-step-actions, [dt-step-actions], [dtStepActions]',
  exportAs: 'dtStepActions',
  host: {
    class: 'dt-step-actions',
  },
})
export class DtStepActions {}

@Component({
  selector: 'dt-stepper',
  exportAs: 'dtStepper',
  templateUrl: 'stepper.html',
  styleUrls: ['stepper.scss'],
  host: {
    class: 'dt-stepper',
    '[class.dt-stepper-linear]': 'linear',
    'aria-orientation': 'horizontal',
    role: 'tablist',
  },
  providers: [{ provide: CdkStepper, useExisting: DtStepper }],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtStepper extends CdkStepper implements AfterContentInit {
  /** @internal The list of step headers of the steps in the stepper. */
  @ViewChildren(DtStepHeader) _stepHeader: QueryList<DtStepHeader>;

  /** @internal Steps that the stepper holds. */
  // tslint:disable-next-line: no-forward-ref
  @ContentChildren(forwardRef(() => DtStep)) _steps: QueryList<DtStep>;

  ngAfterContentInit(): void {
    // Mark the component for change detection whenever the content children query changes
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._stateChanged();
    });
  }

  /** @internal Returns whether the next step is active */
  _isNextStepActive(nextIndex: number): boolean {
    const nextStep =
      this._steps.length > nextIndex && this._steps.toArray()[nextIndex];
    return nextStep && (nextStep.completed || this.selectedIndex === nextIndex);
  }
}
