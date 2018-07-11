import { Component, QueryList, ViewChildren } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { DtBreadcrumbsItem, DtBreadcrumbsModule } from '@dynatrace/angular-components';

describe('DtBreadcrumbs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtBreadcrumbsModule,
      ],
      declarations: [
        TestBreadcrumbs,
      ],
    });
    TestBed.compileComponents();
  }));

  it('should set last property on last child', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbs);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    const lastValues = component.items.map((item: DtBreadcrumbsItem) => item._lastItem);
    expect(lastValues).toEqual([false, false, true]);
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
}
