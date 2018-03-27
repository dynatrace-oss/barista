import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  templateUrl: "switch-form-example.component.html",
})
export class SwitchFormExampleComponent implements OnInit {
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
