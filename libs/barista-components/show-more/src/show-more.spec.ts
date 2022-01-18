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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpXhrBackend } from '@angular/common/http';
import { Component, DebugElement } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtShowMoreModule } from './show-more-module';
import { DtShowMore } from './show-more';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtShowMore', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtShowMoreModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [TestApp],
        providers: [
          {
            provide: HttpXhrBackend,
            useClass: HttpClientTestingModule,
          },
        ],
      });

      TestBed.compileComponents();
    }),
  );

  describe('show-more', () => {
    let fixture;
    let testComponent: TestApp;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;

    beforeEach(
      waitForAsync(() => {
        fixture = createComponent(TestApp);
        testComponent = fixture.componentInstance;
        instanceDebugElement = fixture.debugElement.query(
          By.directive(DtShowMore),
        );
        instanceElement = instanceDebugElement.nativeElement;
      }),
    );

    it('should not contain show-less style', () => {
      expect(instanceElement.classList).not.toContain('dt-show-more-show-less');
    });

    it('should have show-less styles', () => {
      testComponent.showLess = true;
      fixture.detectChanges();
      expect(instanceElement.classList).toContain('dt-show-more-show-less');
    });

    it('should have an aria-label when in show-less state', () => {
      testComponent.showLess = true;
      fixture.detectChanges();
      expect(instanceElement.getAttribute('aria-label')).toBe(
        'Collapse content',
      );
    });

    it('should handle clicks', () => {
      expect(testComponent.clickCount).toBe(0);
      instanceElement.click();
      expect(testComponent.clickCount).toBe(1);
    });

    it('should have disabled styles', () => {
      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(instanceElement.classList).toContain('dt-show-more-disabled');
    });

    it('should not handle clicks when disabled', () => {
      expect(testComponent.clickCount).toBe(0);
      testComponent.isDisabled = true;
      fixture.detectChanges();
      instanceElement.click();
      expect(testComponent.clickCount).toBe(0);
    });

    it('should fire event when the host button is clicked', () => {
      const spied = jest.spyOn(fixture.componentInstance, 'changedHandler');
      instanceElement.click();
      expect(spied).toHaveBeenCalled();
      spied.mockRestore();
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <button
      dt-show-more
      [showLess]="showLess"
      [disabled]="isDisabled"
      (click)="clickHandler()"
      ariaLabelShowLess="Collapse content"
      (changed)="changedHandler()"
    >
      More
    </button>
  `,
})
class TestApp {
  showLess = false;
  isDisabled = false;
  clickCount = 0;

  clickHandler(): void {
    this.clickCount++;
  }

  changedHandler(): void {}
}
