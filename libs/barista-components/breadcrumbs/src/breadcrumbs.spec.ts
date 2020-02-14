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
  DtBreadcrumbsItem,
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
        TestBreadcrumbsWithDeprecatedItems,
      ],
    });
    TestBed.compileComponents();
  }));

  it('should set last property on last child for deprecated dt-breadcrumbs-item', () => {
    const fixture = createComponent(TestBreadcrumbsWithDeprecatedItems);
    const component = fixture.componentInstance;
    const lastValues = component.items.map(
      // tslint:disable-next-line:deprecation
      (item: DtBreadcrumbsItem) => item._lastItem,
    );
    expect(lastValues).toEqual([false, false, true]);
  });

  it('should make sure aria current is set for deprecated dt-breadcrumbs-item', () => {
    const fixture = createComponent(TestBreadcrumbsWithDeprecatedItems);
    const lastItem = fixture.debugElement.query(
      By.css('span[aria-current=page]'),
    );
    expect(lastItem).not.toBeFalsy();
  });

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
    <dt-breadcrumbs [aria-label]="'breadcrumbs'">
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
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbsWithDeprecatedItems {
  // tslint:disable-next-line:deprecation
  @ViewChildren(DtBreadcrumbsItem) items: QueryList<DtBreadcrumbsItem>;
  @ViewChild(DtBreadcrumbs) breadcrumbs: DtBreadcrumbs;
}
