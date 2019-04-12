import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: '<dt-pagination [length]="length" [pageSize]="pageSize" [currentPage]="currentPage"></dt-pagination>',
})
export class ManyPaginationExampleComponent {
  length = 120;
  pageSize = 10;
  currentPage = 5;
}
