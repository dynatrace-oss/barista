import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DtStepper } from '@dynatrace/barista-components/stepper';

@Component({
  selector: 'stepper-barista-example',
  template: `
    <dt-stepper #stepper linear>
      <dt-step label="Type">
        <h2>What type of synthetic monitor do you want to create?</h2>
        <div class="monitor-type-wrapper">
          <div class="monitor-type">
            <img src="/assets/browser-monitor.svg" alt="Browser monitor" />
            <h3>Simulate user behavior in a real browser</h3>
            <p>
              A browser monitor is a simulated user session driven by a modern
              web browser. You can either monitor a URL or record a sequence of
              clicks and user input that should be replayed during monitoring.
            </p>
            <button variant="secondary" dt-button dtStepperNext>
              Create a browser monitor
            </button>
          </div>
          <div class="monitor-type">
            <img src="/assets/http-monitor.svg" alt="HTTP monitor" />
            <h3>Create a basic HTTP monitor</h3>
            <p>
              An HTTP monitor uses a simple HTTP request to monitor the
              availability of a URL used by your application.
            </p>
            <button variant="secondary" dt-button dtStepperNext>
              Create an HTTP monitor
            </button>
          </div>
        </div>
      </dt-step>
      <dt-step [stepControl]="configurationFormGroup" label="Configuration">
        <form [formGroup]="configurationFormGroup">
          <dt-form-field>
            <dt-label>Name this monitor</dt-label>
            <input
              dtInput
              placeholder="For example, mysite"
              formControlName="nameCtrl"
              required
            />
            <dt-error>This field cannot be empty.</dt-error>
          </dt-form-field>
          <dt-step-actions>
            <button dt-button dtStepperPrevious>Previous</button>
            <button dt-button dtStepperNext>Next</button>
          </dt-step-actions>
        </form>
      </dt-step>
      <dt-step label="Frequency and locations">
        <h2>Frequency and locations</h2>
        <dt-form-field>
          <dt-label>Website monitor interval</dt-label>
          <dt-select value="15">
            <dt-option value="15">15 min</dt-option>
            <dt-option value="30">30 min</dt-option>
            <dt-option value="45">45 min</dt-option>
          </dt-select>
        </dt-form-field>
        <dt-step-actions>
          <button dt-button dtStepperPrevious>Previous</button>
          <button dt-button dtStepperNext>Next</button>
        </dt-step-actions>
      </dt-step>
      <dt-step>
        <ng-template dtStepLabel>Summary</ng-template>

        <p>Finished!</p>

        <dt-step-actions>
          <button variant="secondary" dt-button dtStepperPrevious>
            Previous
          </button>
          <button dt-button (click)="stepper.reset()">Reset stepper</button>
        </dt-step-actions>
      </dt-step>
    </dt-stepper>
  `,
  styles: [
    `
      .monitor-type-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        max-width: 800px;
      }
      .monitor-type {
        display: grid;
        grid-template-rows: auto auto 1fr auto;
      }
      .monitor-type img {
        justify-self: center;
      }
    `,
  ],
})
export class StepperDefaultExample implements OnInit {
  @ViewChild(DtStepper, { static: true }) stepper: DtStepper;

  configurationFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.configurationFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: no-unbound-method
      nameCtrl: ['', Validators.required],
    });
  }
}
