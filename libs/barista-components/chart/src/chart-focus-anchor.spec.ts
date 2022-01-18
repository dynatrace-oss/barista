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

import { InteractivityChecker } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import { Component, Provider } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createComponent } from '@dynatrace/testing/browser';
import { DtChartBase } from './chart-base';
import { DtChartFocusAnchor, DtChartFocusTarget } from './chart-focus-anchor';

/** Mock Chart so the targets have a place to register themselves */
export class MockChart {
  _focusTargets = new Set<DtChartFocusTarget>();
}

/**
 * Overrides the default InteractivityChecker to alway set the
 * ignoreVisibility flag to true, as all DOM nodes in Jest would
 * otherwise be detected as not visible and therefore not focusalbe.
 */
export class TestInteractivityChecker extends InteractivityChecker {
  isFocusable(element: any): boolean {
    return super.isFocusable(element, { ignoreVisibility: true });
  }
}

export const TEST_INTERACTIVITY_CHECKER_PROVIDER: Provider = {
  provide: InteractivityChecker,
  useClass: TestInteractivityChecker,
  deps: [Platform],
};

describe('DtChartFocusAnchor', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule],
        providers: [
          { provide: DtChartBase, useClass: MockChart },
          TEST_INTERACTIVITY_CHECKER_PROVIDER,
        ],
        declarations: [
          DtChartFocusAnchor,
          DtChartFocusTarget,
          TestAppSkipFocusElement,
          TestAppFindFocusElement,
        ],
      });

      TestBed.compileComponents();
    }),
  );

  it('should shift focus to the specified target', () => {
    const fixture = createComponent(TestAppSkipFocusElement);
    const focusAnchor = fixture.debugElement.query(
      By.css('dt-chart-focus-anchor'),
    );
    const buttonDebugElement = fixture.debugElement.query(
      By.css('[dtChartFocusTarget]'),
    );

    focusAnchor.nativeElement.focus();
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttonDebugElement.nativeElement);
  });

  it('should shift focus to the specified target', () => {
    const fixture = createComponent(TestAppFindFocusElement);
    const focusAnchor = fixture.debugElement.query(
      By.css('dt-chart-focus-anchor'),
    );
    const buttonDebugElement = fixture.debugElement.query(By.css('button'));

    focusAnchor.nativeElement.focus();
    fixture.detectChanges();
    expect(document.activeElement).toBe(buttonDebugElement.nativeElement);
  });
});

@Component({
  selector: 'test-chart-without-selection-area',
  template: `
    <dt-chart-focus-anchor nextTarget="nextTarget"></dt-chart-focus-anchor>
    <button>Should be skipped</button>
    <button dtChartFocusTarget="nextTarget">Should receive focus</button>
  `,
})
export class TestAppSkipFocusElement {}

@Component({
  selector: 'test-chart-without-selection-area',
  template: `
    <dt-chart-focus-anchor></dt-chart-focus-anchor>
    <div>Should be skipped</div>
    <button>Should receive focus</button>
  `,
})
export class TestAppFindFocusElement {}
