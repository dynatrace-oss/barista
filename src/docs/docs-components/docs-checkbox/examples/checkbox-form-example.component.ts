import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  // @formatter:off
  template: `
  <form [formGroup]="form" (submit)="submit()">
    <dt-checkbox formControlName="agreed" label="I agree..."></dt-checkbox>
    <button class="btn btn--primary" [disabled]="form.invalid">Submit</button>
  </form>
`,
  // @formatter:on
})
export class CheckboxFormExampleComponent {
  public form = new FormGroup({
    agreed: new FormControl(),
  });

  public constructor(private readonly formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.form = this.formBuilder.group({
      agreed: ["false", Validators.pattern("true")],
    });
  }

  public submit(): void {
    // TODO
  }

}
