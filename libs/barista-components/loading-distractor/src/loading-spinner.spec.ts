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

import { Component } from '@angular/core';
import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtLoadingDistractorModule } from '@dynatrace/barista-components/loading-distractor';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtLoadingSpinner', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtLoadingDistractorModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should support setting a custom aria-label', fakeAsync(() => {
    const fixture = createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(
      By.css('dt-loading-spinner'),
    );
    const instance = spinnerElement.componentInstance;
    instance.ariaLabel = 'Custom Label';
    fixture.detectChanges();
    expect(spinnerElement.nativeElement.getAttribute('aria-label')).toEqual(
      'Custom Label',
    );
  }));

  it('should support setting aria-labelledby', fakeAsync(() => {
    const fixture = createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(
      By.css('dt-loading-spinner'),
    );
    const instance = spinnerElement.componentInstance;
    instance.ariaLabelledby = 'test';
    fixture.detectChanges();
    expect(
      spinnerElement.nativeElement.getAttribute('aria-labelledby'),
    ).toEqual('test');
  }));
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-loading-spinner></dt-loading-spinner>
  `,
})
class TestApp {}
