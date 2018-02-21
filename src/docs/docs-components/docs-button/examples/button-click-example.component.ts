import { Component } from "@angular/core";

@Component({
  // @formatter:off
  template: `<div>Click count {{ count }}</div>
<a dt-btn (click)="count = count + 1">Click</a>`,
  // @formatter:on
})
export class ButtonClickExampleComponent {
  public count = 0;
}
