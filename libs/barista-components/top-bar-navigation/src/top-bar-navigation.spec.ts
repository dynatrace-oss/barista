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

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtTopBarNavigationModule } from './top-bar-navigation-module';

export function createFixture<T>(
  component: Type<T>,
  selector?: string,
): {
  fixture: ComponentFixture<T>;
  instance: T;
  containerEl: HTMLElement;
} {
  const fixture = TestBed.createComponent(component);
  const container = selector
    ? fixture.debugElement.query(By.css(selector)).nativeElement
    : undefined;
  return {
    fixture,
    instance: fixture.debugElement.componentInstance,
    containerEl: container,
  };
}

describe('DtTopBarNavigation', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtTopBarNavigationModule],
        declarations: [BasicTopBar, TopBarWithAction],
      });

      TestBed.compileComponents();
    }),
  );

  describe('check the content projection', () => {
    it('should project the content in the right order based on the alignment', () => {
      const fixture = TestBed.createComponent(BasicTopBar);

      const items: HTMLElement[] = [].slice.call(
        fixture.debugElement.nativeElement.querySelectorAll('.dt-top-bar > *'),
      );

      expect(items).toHaveLength(5);
      expect(items[0].textContent).toMatch('1');
      expect(items[1].textContent).toMatch('without property');
      expect(items[2].classList).toContain('dt-top-bar-navigation-spacer');
      expect(items[3].textContent).toMatch('2');
      expect(items[4].textContent).toMatch('3');
    });
  });

  describe('check the top bar action', () => {
    it('should apply the problem to the top-bar-item when it has the top-bar-action', () => {
      const fixture = TestBed.createComponent(TopBarWithAction);
      fixture.detectChanges();

      const items: HTMLElement[] = [].slice.call(
        fixture.debugElement.nativeElement.querySelectorAll('.dt-top-bar > *'),
      );

      expect(items[0].classList).toContain('dt-top-bar-action-has-problem');
      expect(items[1].classList).not.toContain('dt-top-bar-action-has-problem');
    });

    it('should apply the problem to the top-bar-action button', () => {
      const fixture = TestBed.createComponent(TopBarWithAction);
      fixture.detectChanges();

      const item: HTMLButtonElement =
        fixture.debugElement.nativeElement.querySelector('button');
      expect(item.classList).toContain('dt-top-bar-action-has-problem');
    });
  });

  describe('a11y', () => {
    it('should contain the correct aria label', () => {
      const fixture = TestBed.createComponent(BasicTopBar);
      fixture.detectChanges();

      const nav: HTMLElement = fixture.debugElement.query(
        By.css('nav'),
      ).nativeElement;

      expect(nav.getAttribute('aria-label')).toBe('Main');
    });

    it('should be highlighted when focused', () => {
      const fixture = TestBed.createComponent(TopBarWithAction);
      fixture.detectChanges();

      const button: HTMLElement = fixture.debugElement.query(
        By.css('button'),
      ).nativeElement;
      button.focus();

      expect(button.classList).toContain('cdk-program-focused');
    });
  });
});

/** Test component that contains an DtTopBarNavigation. */
@Component({
  selector: 'dt-basic-test-app',
  template: `
    <dt-top-bar-navigation aria-label="Main">
      <dt-top-bar-navigation-item align="start">1</dt-top-bar-navigation-item>
      <dt-top-bar-navigation-item>without property</dt-top-bar-navigation-item>
      <dt-top-bar-navigation-item align="end">2</dt-top-bar-navigation-item>
      <dt-top-bar-navigation-item align="end">3</dt-top-bar-navigation-item>
    </dt-top-bar-navigation>
  `,
})
class BasicTopBar {}

/** Test component that contains an DtTopBarNavigation. */
@Component({
  selector: 'dt-basic-test-app',
  template: `
    <dt-top-bar-navigation aria-label="Main">
      <dt-top-bar-navigation-item align="start" dtTopBarAction hasProblem>
        1
      </dt-top-bar-navigation-item>
      <dt-top-bar-navigation-item>
        <button dtTopBarAction hasProblem>1</button>
      </dt-top-bar-navigation-item>
    </dt-top-bar-navigation>
  `,
})
class TopBarWithAction {}
