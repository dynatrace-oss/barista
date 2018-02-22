import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  // @formatter:off
  template: `<form [formGroup]="formWithSwitch" (submit)="submit()">
    <dt-switch formControlName="enabled">I agree to everything</dt-switch>
    <a dt-btn class="btn btn--primary" [disabled]="formWithSwitch.invalid">Submit</a>
  </form>`,
  // @formatter:on
})
export class SwitchFormExampleComponent {
  public formWithSwitch = new FormGroup({
    enabled: new FormControl(),
  });

  public constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.formWithSwitch = this.formBuilder.group({
      enabled: ["false", Validators.pattern("true")],
    });
  }

  public submit(): void {
    // TODO
  }

}
