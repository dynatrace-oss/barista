/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'secondary-nav-dev-app-demo',
  templateUrl: './secondary-nav-demo.component.html',
})
export class SecondaryNavDemo {
  menu = [
    {
      title: 'Item 1',
      description: 'Description',
      groups: [
        {
          label: 'Group 1',
          links: [
            { routerLink: '/test', label: 'link 1' },
            { href: 'https://google.com', label: 'link 2', active: true },
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
      title: 'Item 2',
      description: 'Description',
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
      title: 'Item 3',
      description: 'Non expanding link',
      routerLink: '/',
    },
    {
      title: 'Item 4',
      description: 'Non expanding external link',
      href: 'https://google.com',
    },
  ];

  addMenuItem(): void {
    this.menu.push({
      title: `Item ${this.menu.length + 1} (push)`,
      description: 'Description',
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
  }
}
