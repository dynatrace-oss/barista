import { Component } from '@angular/core';

@Component({
  selector: 'dt-home',
  template: `
    <p>ui-test tests!</p>
  `,
})
export class Home {}

@Component({
  selector: 'dt-ui-test-app',
  template: '<router-outlet></router-outlet>',
})
export class UIApp {}
