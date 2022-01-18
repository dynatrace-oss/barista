/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { createComponent } from '@dynatrace/testing/browser';
import { DtBreadcrumbsItem2 } from './breadcrumbs-item';
import { DtBreadcrumbsModule } from './breadcrumbs-module';

import { findFirstFocusableItem } from './focusable-items';

describe(`findFirstFocusableItem`, () => {
  beforeAll(() => {
    /**
     * The `_isFocusable` property of the breadcrumb item uses the interactivity checker
     * from angular cdk, which in turn checks the offsetWidth and offsetHeight as part of
     * the focusable check, so we have to mock these, else the check would always return false
     */
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      value: 10,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      value: 10,
    });
  });

  it('should return undefined if an empty array is passed', () => {
    expect(findFirstFocusableItem([])).toBeUndefined();
  });

  describe(`findFirstFocusableItem w/ focusable items`, () => {
    let fixture: ComponentFixture<TestBreadcrumbs>;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtBreadcrumbsModule],
        declarations: [TestBreadcrumbs],
      });
      TestBed.compileComponents();

      fixture = createComponent(TestBreadcrumbs);
      fixture.detectChanges();
    }));

    it('should return first focusable item', () => {
      const firstFocusable = findFirstFocusableItem(
        fixture.componentInstance.items.toArray(),
      );
      expect(firstFocusable).toBeDefined();
      expect(firstFocusable?._elementRef.nativeElement.textContent).toEqual(
        `1`,
      );
    });

    it('should return first focusable item of inversed items', () => {
      const firstFocusable = findFirstFocusableItem(
        fixture.componentInstance.items.toArray().reverse(),
      );
      expect(firstFocusable).toBeDefined();
      expect(firstFocusable?._elementRef.nativeElement.textContent).toEqual(
        `3`,
      );
    });
  });

  describe(`findFirstFocusableItem w/ non-focusable items`, () => {
    let fixture: ComponentFixture<TestNonFocusableBreadcrumbs>;

    beforeEach(fakeAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtBreadcrumbsModule],
        declarations: [TestNonFocusableBreadcrumbs],
      });
      TestBed.compileComponents();

      fixture = createComponent(TestNonFocusableBreadcrumbs);
      fixture.detectChanges();
    }));

    it('should return undefined', () => {
      const firstFocusable = findFirstFocusableItem(
        fixture.componentInstance.items.toArray(),
      );
      expect(firstFocusable).toBeUndefined();
    });

    it('should return undefined', () => {
      const firstFocusable = findFirstFocusableItem(
        fixture.componentInstance.items.toArray().reverse(),
      );
      expect(firstFocusable).toBeUndefined();
    });
  });
});

/** Simple test component with breadcrumbs. */
@Component({
  template: `<dt-breadcrumbs>
    <a dtBreadcrumbsItem href="">1</a>
    <a dtBreadcrumbsItem>2</a>
    <a dtBreadcrumbsItem href="">3</a>
  </dt-breadcrumbs>`,
})
class TestBreadcrumbs {
  @ViewChildren(DtBreadcrumbsItem2) items: QueryList<DtBreadcrumbsItem2>;
}

/** Simple test component with no focusable breadcrumb. */
@Component({
  template: `<dt-breadcrumbs>
    <a dtBreadcrumbsItem>1</a>
    <a dtBreadcrumbsItem>2</a>
    <a dtBreadcrumbsItem>3</a>
  </dt-breadcrumbs>`,
})
class TestNonFocusableBreadcrumbs {
  @ViewChildren(DtBreadcrumbsItem2) items: QueryList<DtBreadcrumbsItem2>;
}
