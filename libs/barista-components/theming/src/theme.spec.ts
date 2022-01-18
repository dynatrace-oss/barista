/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Component, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtThemingModule } from './theming-module';
import { DtTheme } from './theme';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtTheme', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtThemingModule],
        declarations: [TestApp, TestAppParent, TestAppChild],
      });

      TestBed.compileComponents();
    }),
  );

  it('should apply the dt-theme class', () => {
    const fixture = createComponent(TestApp);
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();

    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme'),
    ).toBeTruthy();
  });

  it('should apply the corrent class if a name is set', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains(
        'dt-theme-turquoise',
      ),
    ).toBeTruthy();

    testComponent.theme = 'royalblue:light';
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains(
        'dt-theme-royalblue',
      ),
    ).toBeTruthy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains(
        'dt-theme-turquoise',
      ),
    ).toBeTruthy();

    testComponent.theme = ':dark';
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains(
        'dt-theme-turquoise',
      ),
    ).toBeFalsy();
  });

  it('should apply the corrent class if a variant is set', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const sectionDebugElement = fixture.debugElement.query(By.css('section'));
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-light'),
    ).toBeFalsy();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-dark'),
    ).toBeFalsy();

    testComponent.theme = 'turquoise:light';
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-light'),
    ).toBeTruthy();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-dark'),
    ).toBeFalsy();

    testComponent.theme = 'turquoise:dark';
    fixture.detectChanges();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-light'),
    ).toBeFalsy();
    expect(
      sectionDebugElement.nativeElement.classList.contains('dt-theme-dark'),
    ).toBeTruthy();
  });

  it('should inherit from parent theme', () => {
    const fixture = createComponent(TestAppParent);
    const parentComponent = fixture.debugElement.componentInstance;
    const parentSectionDebugElement = fixture.debugElement.query(
      By.css('.parent-section'),
    );
    const childSectionDebugElement = fixture.debugElement.query(
      By.css('.child-section'),
    );
    const childComponent = parentComponent.child;

    fixture.detectChanges();

    expect(
      parentSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-turquoise',
      ),
    ).toBeTruthy();
    expect(
      parentSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-light',
      ),
    ).toBeTruthy();

    expect(childComponent.dtThemeInstance.name === 'turquoise');
    expect(childComponent.dtThemeInstance.name === 'dark');
    expect(
      childSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-turquoise',
      ),
    ).toBeTruthy();
    expect(
      childSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-dark',
      ),
    ).toBeTruthy();

    childComponent.theme = 'purple';
    fixture.detectChanges();

    expect(
      childSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-purple',
      ),
    ).toBeTruthy();
    expect(
      childSectionDebugElement.nativeElement.classList.contains(
        'dt-theme-light',
      ),
    ).toBeTruthy();
  });

  it('should throw an error if the theme is invalid', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    testComponent.theme = 'wrong:stuff';
    expect(() => fixture.detectChanges()).toThrow();
    testComponent.theme = 'purple:stuff';
    expect(() => fixture.detectChanges()).toThrow();
  });
});

@Component({
  selector: 'dt-test-app',
  template: ` <section [dtTheme]="theme"></section> `,
})
class TestApp {
  theme = 'turquoise';
}

@Component({
  selector: 'dt-test-child',
  template: ` <section class="child-section" [dtTheme]="theme"></section> `,
})
class TestAppChild {
  theme = ':dark';

  @ViewChild(DtTheme, { static: true })
  dtThemeInstance: DtTheme;
}

@Component({
  selector: 'dt-test-parent',
  template: `
    <section class="parent-section" [dtTheme]="theme">
      <dt-test-child></dt-test-child>
    </section>
  `,
})
class TestAppParent {
  theme = 'turquoise:light';

  @ViewChild(TestAppChild, { static: true })
  child: TestAppChild;
}
