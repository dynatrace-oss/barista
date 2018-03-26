import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'home',
  template: `<p>ui-test tests!</p>`
})
export class Home {}

@Component({
  selector: 'ui-test-app',
  templateUrl: 'ui-test-app.html',
  encapsulation: ViewEncapsulation.None,
})
export class UIApp {
  navItems = [
    {name: 'Start', route: '/'},
    {name: 'Button', route: '/button'},
  ];
}
