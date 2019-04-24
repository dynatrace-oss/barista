import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'context-dialog-demo',
  templateUrl: './context-dialog-demo.component.html',
  styleUrls: ['./context-dialog-demo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContextDialogDemo {
  dataSource: Array<{ host: string; cpu: string }> = [
    { host: 'et-demo-2-win4', cpu: '30 %' },
    { host: 'et-demo-2-win3', cpu: '26 %' },
    { host: 'docker-host2', cpu: '25.4 %' },
    { host: 'et-demo-2-win1', cpu: '23 %' },
  ];

  removeRow(row: { host: string; cpu: string }): void {
    this.dataSource = this.dataSource.filter((r) => r !== row);
  }
}
