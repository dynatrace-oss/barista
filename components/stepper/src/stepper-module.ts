import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtStep } from './step';
import { DtStepHeader } from './step-header';
import { DtStepLabel } from './step-label';
import { DtStepActions, DtStepper } from './stepper';
import { DtStepperNext, DtStepperPrevious } from './stepper-button';

const EXPORTS = [
  DtStep,
  DtStepper,
  DtStepLabel,
  DtStepperNext,
  DtStepperPrevious,
  DtStepActions,
];

@NgModule({
  imports: [CommonModule, A11yModule],
  exports: EXPORTS,
  declarations: [...EXPORTS, DtStepHeader],
})
export class DtStepperModule {}
