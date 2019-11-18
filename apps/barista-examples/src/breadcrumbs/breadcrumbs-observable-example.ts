/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-breadcrumbs aria-label="Breadcrumbs navigation">
      <!-- data$ emits a new items list after each 5 seconds -->
      <a
        dtBreadcrumbsItem
        *ngFor="let item of data$ | async"
        [href]="item.href"
      >
        {{ item.label }}
      </a>
    </dt-breadcrumbs>
  `,
})
export class BreadcrumbsObservableExample {
  private readonly interval = 5_000;

  data$: Observable<Array<{ label: string; href?: string }>> = timer(
    0,
    this.interval,
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
    ]),
  );
}
