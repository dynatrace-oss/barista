// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import {
  DtBreadcrumbsItem,
  DtBreadcrumbsModule,
  DtBreadcrumbs,
} from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
import { createComponent } from '../../testing/create-component';

describe('DtBreadcrumbs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtBreadcrumbsModule],
      declarations: [TestBreadcrumbs, TestBreadcrumbsWithAriaAttr],
    });
    TestBed.compileComponents();
  }));

  it('should set last property on last child', () => {
    const fixture = createComponent(TestBreadcrumbs);
    const component = fixture.componentInstance;
    const lastValues = component.items.map(
      (item: DtBreadcrumbsItem) => item._lastItem,
    );
    expect(lastValues).toEqual([false, false, true]);
  });

  it('should make sure aria current is set', () => {
    const fixture = createComponent(TestBreadcrumbs);
    const lastItem = fixture.debugElement.query(
      By.css('span[aria-current=page]'),
    );
    expect(lastItem).not.toBeFalsy();
  });

  it('should make sure aria label is set properly', () => {
    const fixture = createComponent(TestBreadcrumbsWithAriaAttr);
    const breadcrumbs = fixture.debugElement.query(
      By.css('dt-breadcrumbs[aria-label=breadcrumbs]'),
    );

    expect(breadcrumbs).not.toBeFalsy();
  });

  it('should make sure aria label is set programmatically', () => {
    const fixture = createComponent(TestBreadcrumbs);
    const breadcrumbs = fixture.componentInstance.breadcrumbs;
    breadcrumbs.ariaLabel = 'myverycoollabel';

    fixture.detectChanges();

    const breadcrumbsNative = fixture.debugElement.query(
      By.css('dt-breadcrumbs[aria-label=myverycoollabel]'),
    );

    expect(breadcrumbsNative).not.toBeFalsy();
  });
});

@Component({
  template: `
    <dt-breadcrumbs>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbs {
  @ViewChildren(DtBreadcrumbsItem) items: QueryList<DtBreadcrumbsItem>;
  @ViewChild(DtBreadcrumbs, { static: false }) breadcrumbs: DtBreadcrumbs;
}

@Component({
  template: `
    <dt-breadcrumbs [aria-label]="ariaLabel">
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
      <dt-breadcrumbs-item></dt-breadcrumbs-item>
    </dt-breadcrumbs>
  `,
})
class TestBreadcrumbsWithAriaAttr {
  @ViewChildren(DtBreadcrumbsItem) items: QueryList<DtBreadcrumbsItem>;
  ariaLabel = 'breadcrumbs';
}
