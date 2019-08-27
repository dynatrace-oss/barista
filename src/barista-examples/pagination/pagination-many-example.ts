import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template:
    '<dt-pagination [length]="length" [pageSize]="pageSize" [currentPage]="currentPage"></dt-pagination>',
})
export class PaginationManyExample {
  length = 120;
  pageSize = 10;
  currentPage = 5;
}
