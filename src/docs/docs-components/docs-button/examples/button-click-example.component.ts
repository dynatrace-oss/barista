import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<div>Click count {{ count }}</div>
<a class="btn--primary" (click)="count = count + 1">Click</a>`,
  // @formatter:on
})
export class ButtonClickExampleComponent {
  public count = 0;
}
