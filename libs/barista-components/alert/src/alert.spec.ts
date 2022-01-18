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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtAlert } from './alert';
import { DtAlertModule } from './alert-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtAlert', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
          DtAlertModule,
        ],
        declarations: [TestApp, TestAppEmpty],
      });

      TestBed.compileComponents();
    }),
  );

  it('expects css class to be present', () => {
    const fixture = createComponent(TestApp);

    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-alert');
    expect(tileNativeElement.classList.contains('dt-alert')).toBeTruthy();
  });

  it('expects correct css class after change', () => {
    const fixture = createComponent(TestApp);

    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-alert');

    const groupDebugElement = fixture.debugElement.query(By.directive(DtAlert));
    const groupInstance = groupDebugElement.injector.get<DtAlert>(DtAlert);

    groupInstance.severity = 'warning';
    fixture.detectChanges();

    expect(
      tileNativeElement.classList.contains('dt-alert-warning'),
    ).toBeTruthy();

    expect(tileNativeElement.classList.contains('dt-alert-error')).toBeFalsy();
  });

  it('expects no css class to be present by default', () => {
    const fixture = createComponent(TestAppEmpty);

    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-alert');
    expect(tileNativeElement.classList.contains('dt-alert-error')).toBeFalsy();
    expect(
      tileNativeElement.classList.contains('dt-alert-warning'),
    ).toBeFalsy();
  });
});

/** Test component that contains an DtAlert. */
@Component({
  selector: 'dt-test-app',
  template: ` <dt-alert severity="error"></dt-alert> `,
})
class TestApp {}

/** Test component that is not visible by default. */
@Component({
  selector: 'dt-test-app-empty',
  template: ` <dt-alert></dt-alert> `,
})
class TestAppEmpty {}
