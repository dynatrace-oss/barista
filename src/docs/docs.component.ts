import { Component } from '@angular/core';

@Component({
  selector: 'docs-app',
  styleUrls: ['docs.component.scss'],
  templateUrl: 'docs.component.html',
})
export class Docs {
  navItems = [
    {name: 'Start', route: '/'},
    {name: 'Dummy', route: '/dummy'},
  ];
}
