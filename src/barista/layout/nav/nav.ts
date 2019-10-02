import { Component } from '@angular/core';

@Component({
  selector: 'ba-nav',
  templateUrl: 'nav.html',
  styleUrls: ['nav.scss'],
  host: {
    class: 'ba-nav',
  },
})
export class BaNav {
  // TODO: get nav items from page structure? don't hardcode...
  navItems = [
    {
      label: 'Brand',
      url: '/brand/',
    },
    {
      label: 'Resources',
      url: '/resources/',
    },
    {
      label: 'Components',
      url: '/components/',
    },
    {
      label: 'Patterns',
      url: '/patterns/',
    },
    {
      label: 'Tools',
      url: '/tools/',
    },
  ];
}
