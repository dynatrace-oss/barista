import { Component } from '@angular/core';

@Component({
  selector: 'secondary-nav-dev-app-demo',
  templateUrl: './secondary-nav-demo.component.html',
})
export class SecondaryNavDemo {
  count = 3;
  menu = [
    {
      title: 'Section 1',
      description: 'Description 1',
      groups: [
        {
          label: 'Group 1',
          links: [
            { routerLink: '/test', label: 'link 1' },
            { href: 'https://google.com', label: 'link 2' },
          ],
        },
        {
          label: 'Group 2',
          links: [
            { routerLink: '/', label: 'link 1' },
            { routerLink: '/', label: 'link 2' },
          ],
        },
      ],
    },
    {
      title: 'Section 2',
      description: 'Description 1',
      groups: [
        {
          label: 'Group 1',
          links: [
            { routerLink: '/test', label: 'link 1' },
            { href: 'https://google.com', label: 'link 2' },
          ],
        },
        {
          label: 'Group 2',
          links: [
            { routerLink: '/', label: 'link 1' },
            { routerLink: '/', label: 'link 2' },
          ],
        },
      ],
    },
  ];

  addMenuItem(): void {
    this.menu.push({
      title: `Section ${this.count} (push)`,
      description: 'Description 1',
      groups: [
        {
          label: 'Group 1',
          links: [
            { routerLink: '/test', label: 'link 1' },
            { href: 'https://google.com', label: 'link 2' },
          ],
        },
        {
          label: 'Group 2',
          links: [
            { routerLink: '/', label: 'link 1' },
            { routerLink: '/', label: 'link 2' },
          ],
        },
      ],
    });
    this.count = this.count + 1;
  }
}
