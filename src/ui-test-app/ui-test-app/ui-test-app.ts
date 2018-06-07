import {Component} from '@angular/core';

@Component({
  selector: 'dt-home',
  template: `<p>ui-test tests!</p>`,
})
export class Home {}

@Component({
  selector: 'dt-ui-test-app',
  templateUrl: 'ui-test-app.html',
})
export class UIApp {
  navItems = [
    {name: 'Start', route: '/'},
    {name: 'Button', route: '/button'},
    {name: 'ButtonGroup', route: '/button-group'},
    {name: 'Context Dialog', route: '/context-dialog'},
    {name: 'Expandable panel', route: '/expandable-panel'},
    {name: 'Expandable section', route: '/expandable-section'},
    {name: 'Pagination', route: '/pagination'},
    {name: 'radio', route: '/radio'},
    {name: 'Show-more', route: '/show-more'},
    {name: 'tile', route: '/tile'},
  ];
}
