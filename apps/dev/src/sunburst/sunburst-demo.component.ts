/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
  selector: 'sunburst-dev-app-demo',
  templateUrl: './sunburst-demo.component.html',
  styleUrls: ['./sunburst-demo.component.scss'],
})
export class SunburstDemo {
  selectedPath = {
    name: 'Shephard',
    key: 'charSurname',
    children: [
      {
        name: 'Jack',
        key: 'charName',
      },
    ],
  };
  selectedPairs;

  data = [
    {
      // value: 4,
      name: 'Locke',
      key: 'charSurname',
      children: [
        {
          value: 2,
          key: 'charName',
          name: 'John',
        },
        {
          value: 1,
          key: 'actorName',
          name: 'Terry',
        },
        {
          value: 1,
          key: 'actorSurname',
          name: "O'Quinn",
        },
      ],
    },
    {
      // value: 8,
      name: 'Reyes',
      key: 'charSurname',
      children: [
        {
          value: 4,
          key: 'charName',
          name: 'Hugo',
        },
        {
          value: 2,
          key: 'actorName',
          name: 'Jorge',
        },
        {
          value: 2,
          key: 'actorSurname',
          name: 'Garcia',
        },
      ],
    },
    {
      // value: 15,
      name: 'Ford',
      key: 'charSurname',
      children: [
        {
          value: 8,
          key: 'charName',
          name: 'James',
        },
        {
          value: 4,
          key: 'actorName',
          name: 'Josh',
        },
        {
          value: 3,
          key: 'actorSurname',
          name: 'Holloway',
        },
      ],
    },
    {
      // value: 16,
      name: 'Jarrah',
      key: 'charSurname',
      children: [
        {
          value: 8,
          key: 'charName',
          name: 'Sayid',
        },
        {
          value: 4,
          key: 'actorName',
          name: 'Naveen',
        },
        {
          value: 4,
          key: 'actorSurname',
          name: 'Andrews',
        },
      ],
    },
    {
      // value: 23,
      name: 'Shephard',
      key: 'charSurname',
      children: [
        {
          value: 15,
          key: 'charName',
          name: 'Jack',
        },
        {
          value: 4,
          key: 'actorName',
          name: 'Mathew',
        },
        {
          value: 4,
          key: 'actorSurname',
          name: 'Fox',
        },
      ],
    },
    {
      // value: 42,
      name: 'Kwon',
      key: 'charSurname',
      children: [
        {
          value: 15,
          key: 'charName',
          name: 'Jin',
        },
        {
          name: 'Daniel Dae',
          children: [
            {
              value: 15,
              key: 'actorName',
              name: 'Daniel',
            },
            {
              value: 8,
              key: 'actorName',
              name: 'Dae',
            },
          ],
        },
        {
          value: 4,
          key: 'actorSurname',
          name: 'Kim',
        },
      ],
    },
  ];
}
