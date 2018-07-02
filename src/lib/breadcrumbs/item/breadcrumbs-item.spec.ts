import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DtBreadcrumbsModule, DtBreadcrumbsItem } from '@dynatrace/angular-components';

describe('DtBreadcrumbsItem', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtBreadcrumbsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        TestBreadcrumbsItem,
        NonExternalBreadcrumbsItem,
        ExternalBreadcrumbsItem,
        EmptyBreadcrumbsItem,
        EmptyComponent,
      ],
    });
    TestBed.compileComponents();
  }));

  it('should pass the ng-content through', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.text = 'test label';
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement.nativeElement.innerText).toBe('test label');
  });

  [
    {
      href: 'test1/test2',
      expected: '/test1/test2',
    },
    {
      href: '/test1/test2',
      expected: '/test1/test2',
    },
    {
      href: ['test1', 'test2'],
      expected: '/test1/test2',
    },
    {
      href: ['test1', { arg1: 'val1' }, 'test2'],
      expected: '/test1;arg1=val1/test2',
    },
    {
      href: 'http://google.com',
      expected: '/http:/google.com',
    },
  ].forEach((testCase) => {
    it(`should render internal link for href ${testCase.href} if external set to false`, () => {
      const fixture = TestBed.createComponent(TestBreadcrumbsItem);
      const component = fixture.componentInstance;

      component.href = testCase.href;
      fixture.detectChanges();

      const linkElement = fixture.debugElement.query(By.css('a'));
      expect(linkElement.nativeElement.getAttribute('href')).toBe(testCase.expected);
    });
  });

  [
    {
      href: 'http://google.com',
      expected: 'http://google.com',
    },
    {
      href: 'test1/test2',
      expected: 'test1/test2',
    },
  ].forEach((testCase) => {
    it(`should render external link for href ${testCase.href} if external set to true`, () => {
      const fixture = TestBed.createComponent(TestBreadcrumbsItem);
      const component = fixture.componentInstance;

      component.external = true;
      component.href = testCase.href;
      fixture.detectChanges();

      const linkElement = fixture.debugElement.query(By.css('a'));
      expect(linkElement.nativeElement.getAttribute('href')).toBe(testCase.expected);
    });
  });

  it('should render internal link if no external parameter given', () => {
    const fixture = TestBed.createComponent(NonExternalBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'http://google.com';
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement.nativeElement.getAttribute('href')).toBe('/http:/google.com');
  });

  it('should render exterrnal link if empty external parameter given', () => {
    const fixture = TestBed.createComponent(ExternalBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'http://google.com';
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    expect(linkElement.nativeElement.getAttribute('href')).toBe('http://google.com');
  });

  it('should render link _lastItem parameter is set to false', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'test1/test-current';
    component._lastItem = false;
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(linkElement).not.toBeNull();
    expect(spanElement).toBeNull();
  });

  it('should render span if the _lastItem parameter is set to true', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'test1/test2';
    component._lastItem = true;
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(linkElement).toBeNull();
    expect(spanElement).not.toBeNull();
  });

});

@Component({
  template: `<dt-breadcrumbs-item [href]="href" [external]="external">{{ text }}</dt-breadcrumbs-item>`,
})
class TestBreadcrumbsItem {
  text = '';
  // tslint:disable-next-line no-any
  href: string | any[] = '';
  external = false;

  @ViewChild(DtBreadcrumbsItem) item;

  set _lastItem(value: boolean | undefined) {
    this.item._lastItem = value;
  }
}

@Component({
  template: `<dt-breadcrumbs-item [href]="href"></dt-breadcrumbs-item>`,
})
class NonExternalBreadcrumbsItem {
  // tslint:disable-next-line no-any
  href: string | any[] = '';
}

@Component({
  template: `<dt-breadcrumbs-item [href]="href" external></dt-breadcrumbs-item>`,
})
class ExternalBreadcrumbsItem {
  // tslint:disable-next-line no-any
  href: string | any[] = '';
}

@Component({
  template: `<dt-breadcrumbs-item></dt-breadcrumbs-item>`,
})
class EmptyBreadcrumbsItem {
}

@Component({
  template: '',
})
class EmptyComponent {}
