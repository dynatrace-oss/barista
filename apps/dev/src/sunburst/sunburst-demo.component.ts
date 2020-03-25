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
import { DtSunburstNode } from '@dynatrace/barista-components/sunburst';
import { dtFlattenSunburstToFilter } from 'libs/barista-components/sunburst/src/sunburst.util';

@Component({
  selector: 'sunburst-dev-app-demo',
  templateUrl: './sunburst-demo.component.html',
  styleUrls: ['./sunburst-demo.component.scss'],
})
export class SunburstDemo {
  selected: DtSunburstNode[] = [
    {
      filterValue: 'Shephard',
      label: 'Shephard',
      filterKey: 'charSurname',
      children: [
        {
          filterValue: 'Jack',
          label: 'Jack',
          filterKey: 'charName',
        },
      ],
    },
  ];
  selectedFilter;

  series = [
    {
      // value: 4,
      filterValue: 'Locke',
      label: 'Locke',
      filterKey: 'charSurname',
      children: [
        {
          value: 2,
          filterKey: 'charName',
          filterValue: 'John',
          label: 'John',
        },
        {
          value: 1,
          filterKey: 'actorName',
          filterValue: 'Terry',
          label: 'Terry',
        },
        {
          value: 1,
          filterKey: 'actorSurname',
          filterValue: "O'Quinn",
          label: "O'Quinn",
        },
      ],
    },
    {
      // value: 8,
      filterValue: 'Reyes',
      label: 'Reyes',
      filterKey: 'charSurname',
      children: [
        {
          value: 4,
          filterKey: 'charName',
          filterValue: 'Hugo',
          label: 'Hugo',
        },
        {
          value: 2,
          filterKey: 'actorName',
          filterValue: 'Jorge',
          label: 'Jorge',
        },
        {
          value: 2,
          filterKey: 'actorSurname',
          filterValue: 'Garcia',
          label: 'Garcia',
        },
      ],
    },
    {
      // value: 15,
      filterValue: 'Ford',
      label: 'Ford',
      filterKey: 'charSurname',
      children: [
        {
          value: 8,
          filterKey: 'charName',
          filterValue: 'James',
          label: 'James',
        },
        {
          value: 4,
          filterKey: 'actorName',
          filterValue: 'Josh',
          label: 'Josh',
        },
        {
          value: 3,
          filterKey: 'actorSurname',
          filterValue: 'Holloway',
          label: 'Holloway',
        },
      ],
    },
    {
      // value: 16,
      filterValue: 'Jarrah',
      label: 'Jarrah',
      filterKey: 'charSurname',
      children: [
        {
          value: 8,
          filterKey: 'charName',
          filterValue: 'Sayid',
          label: 'Sayid',
        },
        {
          value: 4,
          filterKey: 'actorName',
          filterValue: 'Naveen',
          label: 'Naveen',
        },
        {
          value: 4,
          filterKey: 'actorSurname',
          filterValue: 'Andrews',
          label: 'Andrews',
        },
      ],
    },
    {
      // value: 23,
      filterValue: 'Shephard',
      label: 'Shephard',
      filterKey: 'charSurname',
      children: [
        {
          value: 15,
          filterKey: 'charName',
          filterValue: 'Jack',
          label: 'Jack',
        },
        {
          value: 4,
          filterKey: 'actorName',
          filterValue: 'Mathew',
          label: 'Mathew',
        },
        {
          value: 4,
          filterKey: 'actorSurname',
          filterValue: 'Fox',
          label: 'Fox',
        },
      ],
    },
    {
      // value: 42,
      filterValue: 'Kwon',
      label: 'Kwon',
      filterKey: 'charSurname',
      children: [
        {
          value: 15,
          filterKey: 'charName',
          filterValue: 'Jin',
          label: 'Jin',
        },
        {
          filterKey: 'actorName',
          filterValue: 'Daniel Dae',
          label: 'Daniel Dae',
          children: [
            {
              value: 15,
              filterKey: 'actorName',
              filterValue: 'Daniel',
              label: 'Daniel',
            },
            {
              value: 8,
              filterKey: 'actorName',
              filterValue: 'Dae',
              label: 'Dae',
            },
          ],
        },
        {
          value: 4,
          filterKey: 'actorSurname',
          filterValue: 'Kim',
          label: 'Kim',
        },
      ],
    },
  ];

  select(selected: DtSunburstNode[] = []): void {
    this.selected = selected;
    this.selectedFilter = dtFlattenSunburstToFilter(selected);
  }
}
