import { Component } from '@angular/core';

@Component({
  selector: 'docs-app',
  styleUrls: ['docs.component.scss'],
  templateUrl: 'docs.component.html',
})
export class Docs {
  navItems = [
    {name: 'Alert', route: '/alert-component'},
    {name: 'Button', route: '/button'},
    {name: 'Button Group', route: '/button-group'},
    {name: 'Card', route: '/card'},
    {name: 'Chart', route: '/chart'},
    {name: 'Checkbox', route: '/checkbox'},
    {name: 'Context dialog', route: '/context-dialog'},
    {name: 'Expandable panel', route: '/expandable-panel'},
    {name: 'Expandable section', route: '/expandable-section'},
    {name: 'Inline Editor', route: '/inline-editor'},
    {name: 'Form field', route: '/form-field'},
    {name: 'Icon', route: '/icon'},
    {name: 'Input', route: '/input'},
    {name: 'Links', route: '/links'},
    {name: 'Loading distractor', route: '/loading-distractor'},
    {name: 'Pagination', route: '/pagination'},
    {name: 'Progress circle', route: '/progress-circle'},
    {name: 'Radio', route: '/radio'},
    {name: 'Show more', route: '/show-more'},
    {name: 'Table', route: '/table'},
    {name: 'Tag', route: '/tag'},
    {name: 'Tile', route: '/tile'},
  ];
  selectedTheme = 'turquoise';
}
