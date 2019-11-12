import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'stepper-barista-example',
  template: `
    <dt-checkbox [checked]="isEditable" (change)="isEditable = !isEditable">
      editable steps
    </dt-checkbox>
    <dt-stepper #stepper linear>
      <dt-step [stepControl]="firstFormGroup" [editable]="isEditable">
        <form [formGroup]="firstFormGroup">
          <ng-template dtStepLabel>Fill out your name</ng-template>
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
      <dt-step [stepControl]="secondFormGroup" [editable]="isEditable">
        <form [formGroup]="secondFormGroup">
          <ng-template dtStepLabel>Fill out your address</ng-template>
          <dt-form-field>
            <dt-label>Address</dt-label>
            <input dtInput formControlName="secondCtrl" required />
            <dt-error>Address is required</dt-error>
          </dt-form-field>
          <dt-step-actions>
            <button dt-button dtStepperPrevious *ngIf="isEditable">Back</button>
            <button dt-button dtStepperNext>Next</button>
          </dt-step-actions>
        </form>
      </dt-step>
      <dt-step>
        <ng-template dtStepLabel>Step 3</ng-template>

        <p>Finished!</p>

        <dt-step-actions>
          <button variant="secondary" (click)="stepper.previous()" dt-button>
            Previous
          </button>
          <button dt-button (click)="stepper.reset()">Reset stepper</button>
        </dt-step-actions>
      </dt-step>
    </dt-stepper>
  `,
})
export class StepperEditableExample implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;

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
