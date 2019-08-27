import { CdkStepLabel } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

@Directive({
  selector: '[dtStepLabel]',
  exportAs: 'dtStepLabel',
  host: {
    class: 'dt-step-label',
  },
})
export class DtStepLabel extends CdkStepLabel {}
