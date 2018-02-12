import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<a class="btn">"btn" class</a>
<a class="btn--primary">Just "btn--primary" class</a>
<a class="other-class btn--secondary">Just "btn--secondary" class</a>
<button class="btn--primary">"button" tag</button>
<input type="button" value="input[type='button']" class="btn--primary" />`,
  // @formatter:on
})
export class ButtonTagExampleComponent {
}
