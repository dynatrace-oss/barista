// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component, ViewChild } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DtBreadcrumbsItem,
  DtBreadcrumbsModule,
} from '@dynatrace/angular-components/breadcrumbs';
import { createComponent } from '../../../testing/create-component';
import { createMouseEvent } from '../../../testing/event-objects';

describe('DtBreadcrumbsItem', () => {
  describe('Router provided', () => {
    let router: Router;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [DtBreadcrumbsModule, RouterTestingModule.withRoutes([])],
        declarations: [
          TestBreadcrumbsItem,
          NonExternalBreadcrumbsItem,
          ExternalBreadcrumbsItem,
          EmptyBreadcrumbsItem,
          EmptyComponent,
        ],
      });
      TestBed.compileComponents();

      router = TestBed.get(Router);
    }));

    it('should pass the ng-content through', () => {
      const fixture = TestBed.createComponent(TestBreadcrumbsItem);
      const component = fixture.componentInstance;

      component.text = 'test label';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const link = compiled.querySelector('a');
      expect(link.textContent).toMatch(/test label/);
    });

    describe('href attribute', () => {
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
          expected: '/http:',
        },
      ].forEach(testCase => {
        it(`should render internal link for href ${testCase.href} if external set to false`, () => {
          const fixture = createComponent(TestBreadcrumbsItem);
          const component = fixture.componentInstance;

          component.href = testCase.href;
          fixture.detectChanges();

          const linkElement = fixture.debugElement.query(By.css('a'));
          expect(linkElement.nativeElement.getAttribute('href')).toBe(
            testCase.expected,
          );
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
      ].forEach(testCase => {
        it(`should render external link for href ${testCase.href} if external set to true`, () => {
          const fixture = createComponent(TestBreadcrumbsItem);
          const component = fixture.componentInstance;

          component.external = true;
          component.href = testCase.href;
          fixture.detectChanges();

          const linkElement = fixture.debugElement.query(By.css('a'));
          expect(linkElement.nativeElement.getAttribute('href')).toBe(
            testCase.expected,
          );
        });
      });

      it('should render internal link if no external parameter given', () => {
        const fixture = createComponent(NonExternalBreadcrumbsItem);
        const component = fixture.componentInstance;

        component.href = 'http://google.com';
        fixture.detectChanges();

        const linkElement = fixture.debugElement.query(By.css('a'));
        expect(linkElement.nativeElement.getAttribute('href')).toBe('/http:');
      });

      it('should render external link if empty external parameter given', () => {
        const fixture = createComponent(ExternalBreadcrumbsItem);
        const component = fixture.componentInstance;

        component.href = 'http://google.com';
        fixture.detectChanges();

        const linkElement = fixture.debugElement.query(By.css('a'));
        expect(linkElement.nativeElement.getAttribute('href')).toBe(
          'http://google.com',
        );
      });

      it('should render link _lastItem parameter is set to false', () => {
        const fixture = createComponent(TestBreadcrumbsItem);
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
        const fixture = createComponent(TestBreadcrumbsItem);
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

    describe('link click handler', () => {
      ['metaKey', 'shiftKey', 'ctrlKey'].forEach(key => {
        it(`should bubble the event if ${key} key is pressed`, () => {
          const event = createMouseEvent('click');
          const spied = jest
            .spyOn(event, key as any, 'get')
            .mockImplementation(() => true);

          jest.spyOn(router, 'navigateByUrl');

          const fixture = TestBed.createComponent(TestBreadcrumbsItem);
          const component = fixture.componentInstance;

          component.href = 'test1/test2';
          fixture.detectChanges();

          // when
          const bubbled = component.click(event);

          // then
          expect(bubbled).toBeTruthy();
          // tslint:disable-next-line no-unbound-method
          expect(router.navigateByUrl).not.toHaveBeenCalled();

          spied.mockClear();
        });
      });

      it('should bubble the event if external', () => {
        // given
        const event = createMouseEvent('click');
        jest.spyOn(router, 'navigateByUrl');
        const fixture = TestBed.createComponent(TestBreadcrumbsItem);
        const component = fixture.componentInstance;

        component.href = 'test1/test2';
        component.external = true;
        fixture.detectChanges();

        // when
        const bubbled = component.click(event);

        // then
        expect(bubbled).toBeTruthy();
        // tslint:disable-next-line no-unbound-method
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      });

      it('should handle navigation if link is internal', () => {
        // given
        const event = createMouseEvent('click');
        jest
          .spyOn(router, 'navigateByUrl')
          .mockImplementation(async () => Promise.resolve(true));
        const fixture = TestBed.createComponent(TestBreadcrumbsItem);
        const component = fixture.componentInstance;

        component.href = 'test1/test2';
        fixture.detectChanges();

        // when
        const bubbled = component.click(event);

        // then
        expect(bubbled).toBeFalsy();
        // tslint:disable-next-line no-unbound-method
        expect(router.navigateByUrl).toHaveBeenCalled();
      });
    });
  });

  describe('Router not provided', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [DtBreadcrumbsModule],
        declarations: [NonExternalBreadcrumbsItem, ExternalBreadcrumbsItem],
      });
      TestBed.compileComponents();
    }));

    it('should render external link if empty external parameter given', () => {
      const fixture = TestBed.createComponent(ExternalBreadcrumbsItem);
      const component = fixture.componentInstance;

      component.href = 'http://google.com';
      fixture.detectChanges();

      const linkElement = fixture.debugElement.query(By.css('a'));
      expect(linkElement.nativeElement.getAttribute('href')).toBe(
        'http://google.com',
      );
    });

    it('should throw an error if no external parameter given', () => {
      const fixture = TestBed.createComponent(NonExternalBreadcrumbsItem);
      const component = fixture.componentInstance;

      component.href = 'http://google.com';

      expect(() => fixture.detectChanges()).toThrow();
    });
  });
});

@Component({
  template: `
    <dt-breadcrumbs-item [href]="href" [external]="external">
      {{ text }}
    </dt-breadcrumbs-item>
  `,
})
class TestBreadcrumbsItem {
  text = '';
  // tslint:disable-next-line no-any
  href: string | any[] = '';
  external = false;

  @ViewChild(DtBreadcrumbsItem, { static: false }) item;

  set _lastItem(value: boolean) {
    this.item._lastItem = value;
  }

  click(event: MouseEvent): boolean {
    return this.item._linkClicked(event);
  }
}

@Component({
  template: `
    <dt-breadcrumbs-item [href]="href"></dt-breadcrumbs-item>
  `,
})
class NonExternalBreadcrumbsItem {
  // tslint:disable-next-line no-any
  href: string | any[] = '';
}

@Component({
  template: `
    <dt-breadcrumbs-item [href]="href" external></dt-breadcrumbs-item>
  `,
})
class ExternalBreadcrumbsItem {
  // tslint:disable-next-line no-any
  href: string | any[] = '';
}

@Component({
  template: `
    <dt-breadcrumbs-item></dt-breadcrumbs-item>
  `,
})
class EmptyBreadcrumbsItem {}

@Component({
  template: '',
})
class EmptyComponent {}
