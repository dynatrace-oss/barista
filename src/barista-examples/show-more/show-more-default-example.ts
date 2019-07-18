import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <ul>
      <li *ngFor="let entry of displayData">{{ entry }}</li>
    </ul>
    <button dt-show-more (click)="loadMore()" *ngIf="itemsLeft > 0">
      Show {{ itemsLeft > noOfItems ? noOfItems : itemsLeft }} more
    </button>
    <p *ngIf="itemsLeft < 1" style="text-align: center;">
      No more data available.
    </p>
  `,
})
export class ShowMoreDefaultExample {
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
