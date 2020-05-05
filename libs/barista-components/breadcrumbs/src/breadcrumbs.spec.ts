/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  DtBreadcrumbs,
  DtBreadcrumbsItem2,
  DtBreadcrumbsModule,
} from '@dynatrace/barista-components/breadcrumbs';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtBreadcrumbs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtBreadcrumbsModule],
      declarations: [
        TestBreadcrumbs,
        TestBreadcrumbsWithAriaAttr,
        TestBreadcrumbsWithItems,
      ],
    });
    TestBed.compileComponents();
  }));

  it('should make sure aria current is set', () => {
    const fixture = createComponent(TestBreadcrumbs);
    const lastItem = fixture.debugElement.query(By.css('a[aria-current=page]'));
    expect(lastItem).not.toBeFalsy();
  });

  it('should make sure aria label is set properly', () => {
    const fixture = createComponent(TestBreadcrumbsWithAriaAttr);
    const breadcrumbs = fixture.debugElement.query(
      By.css('dt-breadcrumbs[aria-label=breadcrumbs]'),
    );

    expect(breadcrumbs).not.toBeFalsy();
  });
});

@Component({
  template: `
    <dt-breadcrumbs>
      <a dtBreadcrumbsItem></a>
      <a dtBreadcrumbsItem></a>
      <a dtBreadcrumbsItem></a>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbs {
  @ViewChild(DtBreadcrumbs) breadcrumbs: DtBreadcrumbs;
}

@Component({
  template: `
    <dt-breadcrumbs [attr.aria-label]="'breadcrumbs'">
      <a dtBreadcrumbsItem></a>
      <a dtBreadcrumbsItem></a>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbsWithAriaAttr {
  ariaLabel = 'breadcrumbs';
}

@Component({
  template: `
    <dt-breadcrumbs>
      <a dtBreadcrumbsItem></a>
      <a dtBreadcrumbsItem></a>
      <a dtBreadcrumbsItem></a>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbsWithItems {
  @ViewChildren(DtBreadcrumbsItem2) items: QueryList<DtBreadcrumbsItem2>;
  @ViewChild(DtBreadcrumbs) breadcrumbs: DtBreadcrumbs;
}
