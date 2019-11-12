import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stepper-barista-example',
  template: `
    <dt-checkbox [checked]="isLinear" (change)="isLinear = !isLinear">
      linear steps
    </dt-checkbox>
    <dt-stepper #stepper [linear]="isLinear">
      <dt-step [stepControl]="firstFormGroup">
        <form [formGroup]="firstFormGroup">
          <ng-template dtStepLabel
            >Fill out your name Fill out your name Fill out your name Fill out
            your name</ng-template
          >
          <dt-form-field>
            <dt-label>Name</dt-label>
            <input dtInput formControlName="firstCtrl" required />
            <dt-error>Name is required</dt-error>
          </dt-form-field>
          <dt-step-actions>
            <button dt-button dtStepperNext>Next</button>
          </dt-step-actions>
        </form>
      </dt-step>
      <dt-step [stepControl]="secondFormGroup">
        <form [formGroup]="secondFormGroup">
          <ng-template dtStepLabel>Fill out your address</ng-template>
          <dt-form-field>
            <dt-label>Address</dt-label>
            <input dtInput formControlName="secondCtrl" required />
            <dt-error>Address is required</dt-error>
          </dt-form-field>
          <dt-step-actions>
            <button dt-button variant="secondary" dtStepperPrevious>
              Back
            </button>
            <button dt-button dtStepperNext>Next</button>
          </dt-step-actions>
        </form>
      </dt-step>
      <dt-step>
        <ng-template dtStepLabel>Step 3</ng-template>

        <p>Finished!</p>

        <dt-step-actions>
          <button dt-button variant="secondary" (click)="stepper.previous()">
            Previous
          </button>
          <button dt-button (click)="stepper.reset()">Reset stepper</button>
        </dt-step-actions>
      </dt-step>
    </dt-stepper>
  `,
})
export class StepperLinearExample implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isLinear = true;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: no-unbound-method
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: no-unbound-method
      secondCtrl: ['', Validators.required],
    });
  }
}
