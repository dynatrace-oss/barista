import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-breadcrumbs aria-label="Breadcrumbs navigation">
      <!-- data$ emits a new items list after each 5 seconds -->
      <dt-breadcrumbs-item
        *ngFor="let item of data$ | async"
        [href]="item.href"
      >
        {{ item.label }}
      </dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
export class BreadcrumbsObservableExample {
  private readonly interval = 5_000;

  data$: Observable<Array<{ label: string; href?: string }>> = timer(
    0,
    this.interval
  ).pipe(
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
      },
    ])
  );
}
