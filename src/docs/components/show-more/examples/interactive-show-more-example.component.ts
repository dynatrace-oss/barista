import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-show-more [showMore]="showMore" #dtshowmore (changed)="showMore=!showMore">
  <ng-container *ngIf="dtshowmore.showMore; else elseBlock">Show more</ng-container><ng-template #elseBlock>Show less</ng-template>
</dt-show-more>
<button dt-button (click)="showMore=!showMore" [variant]="showMore ? 'primary' : 'secondary'">Toggle more</button>
  `,
})
export class InteractiveShowMoreExampleComponent { }
