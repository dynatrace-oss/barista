import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<a dt-btn>Just "btn" class</a>
<a dt-btn>"btn primary" class</a>
<a dt-btn secondary>"btn secondary" class</a>
<button dt-btn>"button" tag</button>
<button dt-btn disabled>"button" tag disabled</button>
<input type="button" value="input[type='button']" dt-btn />`,
  // @formatter:on
})
export class ButtonTagExampleComponent {
}
