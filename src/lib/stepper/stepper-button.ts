import { CdkStepperNext, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Directive } from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  selector: 'button[dt-button][dtStepperNext]',
  exportAs: 'dtStepperNext',
  host: {
    class: 'dt-stepper-next',
  },
})
export class DtStepperNext extends CdkStepperNext {}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  selector: 'button[dt-button][dtStepperPrevious]',
  exportAs: 'dtStepperPrevious',
  host: {
    class: 'dt-stepper-previous',
  },
})
export class DtStepperPrevious extends CdkStepperPrevious {}
