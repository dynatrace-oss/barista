/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import {
  DtShowMore,
  DtShowMoreModule,
} from '@dynatrace/barista-components/show-more';

import { createComponent } from '@dynatrace/barista-components/testing';

describe('DtShowMore', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtShowMoreModule,
        HttpClientModule,
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
  }));

  describe('show-more', () => {
    let fixture;
    let testComponent: TestApp;
    let instanceDebugElement: DebugElement;
    let instanceElement: HTMLElement;

    beforeEach(async(() => {
      fixture = createComponent(TestApp);
      testComponent = fixture.componentInstance;
      instanceDebugElement = fixture.debugElement.query(
        By.directive(DtShowMore),
      );
      instanceElement = instanceDebugElement.nativeElement;
    }));

    it('should not contain less style', () => {
      expect(instanceElement.classList).not.toContain('dt-show-more-show-less');
    });

    it('should have less styles', () => {
      testComponent.showLess = true;
      fixture.detectChanges();

      expect(instanceElement.classList).toContain('dt-show-more-show-less');
    });

    it('should fire event', () => {
      expect(testComponent.eventsFired).toBe(0);

      instanceElement.click();

      expect(testComponent.eventsFired).toBe(1);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-show-more [showLess]="showLess" (changed)="eventFired()">
      More
    </dt-show-more>
  `,
})
class TestApp {
  showLess = false;
  eventsFired = 0;

  eventFired(): void {
    this.eventsFired++;
  }
}
