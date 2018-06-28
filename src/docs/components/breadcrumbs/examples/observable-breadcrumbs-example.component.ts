import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
    <dt-breadcrumbs>
      <!-- data$ emits a new items list after each 5 seconds -->
      <dt-breadcrumbs-item *ngFor="let item of data$ | async" [href]="item.href">{{ item.label }}</dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
@OriginalClassName('ObservableBreadcrumbsExampleComponent')
export class ObservableBreadcrumbsExampleComponent {
  private readonly interval = 5_000;

  constructor(private readonly router: Router) {}

  data$: Observable<Array<{label: string; href: string}>> = timer(0, this.interval)
    .pipe(
      map((i: number) => [
        {
          label: `First view ${i}`,
          href: 'first',
        },
        {
          label: `Second view ${i + 1}`,
          href: 'first/second',
        },
        {
          // tslint:disable-next-line no-magic-numbers
          label: `Current view ${i + 2}`,
          href: this.router.url,
        },
      ])
    );
}
