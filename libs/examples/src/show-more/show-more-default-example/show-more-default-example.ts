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
  selector: 'dt-example-show-more-default',
  templateUrl: './show-more-default-example.html',
})
export class DtExampleShowMoreDefault {
  data = [
    'The Perfect Pour',
    'Affogato',
    'Americano',
    'Bicerin',
    'Breve',
    'Café au lait',
    'Café Corretto',
    'Café Crema',
    'Café Latte',
    'Café macchiato',
    'Café mélange',
    'Coffee milk',
    'Cafe mocha',
    'Ca phe sua da',
    'Kopi susu',
    'Cappuccino',
    'Carajillo',
    'Cortado',
    'Cuban espresso',
    'Espresso',
    'The Flat White',
    'Frappuccino',
    'Galao',
    'Greek frappé coffee',
    'Iced Coffee',
    'Indian filter coffee',
    'Instant coffee',
    'Irish coffee',
    'Kopi Luwak',
    'Kopi Tubruk',
    'Turkish coffee',
    'Vienna coffee',
    'Yuanyang',
  ];

  count = 0;
  noOfItems = 5;
  displayData = this.data.slice(this.count, this.noOfItems);
  itemsLeft = this.data.length - this.displayData.length;

  loadMore(): void {
    this.count += 1;
    const start = this.count * this.noOfItems;
    const end = start + this.noOfItems;
    const newData = this.data.slice(start, end);
    this.displayData = [...this.displayData, ...newData];
    this.itemsLeft = this.data.length - this.displayData.length;
  }
}
