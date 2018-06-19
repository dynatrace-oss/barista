import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DtBreadcrumbsModule } from '../breadcrumbs-module';

describe('DtBreadcrumbsItem', () => {

  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtBreadcrumbsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'test1',
            children: [
              {
                path: 'test-current',
                component: EmptyComponent,
              },
            ],
          },
        ]),
      ],
      declarations: [
        TestBreadcrumbsItem,
        NonExternalBreadcrumbsItem,
        ExternalBreadcrumbsItem,
        EmptyComponent,
      ],
    });
    TestBed.compileComponents();

    router = TestBed.get(Router);
    router.initialNavigation();
    router.navigateByUrl('/test1/test-current');
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

  it('should render span if the route is active', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'test1/test-current';
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(linkElement).toBeNull();
    expect(spanElement).not.toBeNull();
  });

  it('should render link if the route is active but active parameter is set to false', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'test1/test-current';
    component.active = false;
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(linkElement).not.toBeNull();
    expect(spanElement).toBeNull();
  });

  it('should render span if the route is not active but active parameter is set to true', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbsItem);
    const component = fixture.componentInstance;

    component.href = 'test1/test2';
    component.active = true;
    fixture.detectChanges();

    const linkElement = fixture.debugElement.query(By.css('a'));
    const spanElement = fixture.debugElement.query(By.css('span'));
    expect(linkElement).toBeNull();
    expect(spanElement).not.toBeNull();
  });

});

@Component({
  template: `<dt-breadcrumbs-item [href]="href" [external]="external" [active]="active">{{ text }}</dt-breadcrumbs-item>`,
})
class TestBreadcrumbsItem {
  text = '';
  // tslint:disable-next-line no-any
  href: string | any[] = '';
  external = false;
  active: boolean | undefined = undefined;
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
  template: '',
})
class EmptyComponent {}
