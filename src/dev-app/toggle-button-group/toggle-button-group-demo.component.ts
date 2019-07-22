import { Component } from '@angular/core';
import { DtToggleButtonChange } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  templateUrl: './toggle-button-group-demo.component.html',
  styleUrls: ['./toggle-button-group-demo.component.scss'],
})
export class ToggleButtonGroupDemo {
  items: number[] = [1, 2, 3];
  loadMoreItems: string[] = [
    'lr-co-cf40001v.dynatrace.vmta',
    'lr-co-cf40002v.dynatrace.vmta',
    'lr-co-cf40003v.dynatrace.vmta',
    'lr-co-cf40004v.dynatrace.vmta',
    'lr-co-cf40005v.dynatrace.vmta',
    'lr-co-cf40006v.dynatrace.vmta',
    'lr-co-cf40007v.dynatrace.vmta',
    'lr-co-cf40008v.dynatrace.vmta',
  ];
  hasMoreItems = true;

  handleSelectionChange(change: DtToggleButtonChange<string>): void {
    console.log(change);
  }

  addItem(): void {
    let newNumber = this.items[this.items.length - 1] + 1;
    if (isNaN(newNumber)) {
      newNumber = 0;
    }
    this.items.push(newNumber);
  }

  removeItem(): void {
    this.items.pop();
  }

  handleLoadMoreItems(): void {
    this.loadMoreItems.push(
      'lr-co-cf40009v.dynatrace.vmta',
      'lr-co-cf400010v.dynatrace.vmta',
      'lr-co-cf400011v.dynatrace.vmta',
      'lr-co-cf400012v.dynatrace.vmta',
      'lr-co-cf400013v.dynatrace.vmta',
    );
    this.hasMoreItems = false;
  }
}
