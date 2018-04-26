import { Component } from '@angular/core';

@Component({
  selector: 'docs-app',
  styleUrls: ['docs.component.scss'],
  templateUrl: 'docs.component.html',
})
export class Docs {
  navItems = [
    {name: 'Start', route: '/'},
    {name: 'Button', route: '/button'},
    {name: 'Expandable panel', route: '/expandable-panel'},
    {name: 'Expandable section', route: '/expandable-section'},
    {name: 'Input', route: '/input'},
    {name: 'Links', route: '/links'},
    {name: 'Loading distractor', route: '/loading-distractor'},
    {name: 'Table', route: '/table'},
  ];
}
