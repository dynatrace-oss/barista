import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'default-demo',
  templateUrl: 'empty-state-demo.html',
})
export class EmptyStateDemo {
  multiple = true;
  dataSource: object[] = [];
  emptyState = {
    title: 'No data that matches your query',
    message: `Amend the timefrime you're querying within or
    review your query to make your statement less restrictive.`,
  };
}
