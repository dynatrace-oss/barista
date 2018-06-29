import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-pagination [maxPages]="11"></dt-pagination>',
})
@OriginalClassName('ManyPaginationExampleComponent')
export class ManyPaginationExampleComponent { }
