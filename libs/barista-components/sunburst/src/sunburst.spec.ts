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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtSunburst } from './sunburst';
import { DtSunburstModule } from './sunburst-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtSunburst', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtSunburstModule,
      ],
      declarations: [TestApp, TestAppEmpty],
    });

    TestBed.compileComponents();
  }));

  it('expects css class to be present', () => {
    const fixture = createComponent(TestApp);

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector(
      'dt-sunburst',
    );
    expect(tileNativeElement.classList.contains('dt-sunburst')).toBeTruthy();
  });

  it('expects correct css class after change', () => {
    const fixture = createComponent(TestApp);

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector(
      'dt-sunburst',
    );

    const groupDebugElement = fixture.debugElement.query(
      By.directive(DtSunburst),
    );
    const groupInstance = groupDebugElement.injector.get<DtSunburst>(
      DtSunburst,
    );

    groupInstance.severity = 'warning';
    fixture.detectChanges();

    expect(
      tileNativeElement.classList.contains('dt-sunburst-warning'),
    ).toBeTruthy();

    expect(
      tileNativeElement.classList.contains('dt-sunburst-error'),
    ).toBeFalsy();
  });

  it('expects no css class to be present by default', () => {
    const fixture = createComponent(TestAppEmpty);

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector(
      'dt-sunburst',
    );
    expect(
      tileNativeElement.classList.contains('dt-sunburst-error'),
    ).toBeFalsy();
    expect(
      tileNativeElement.classList.contains('dt-sunburst-warning'),
    ).toBeFalsy();
  });
});

/** Test component that contains an DtSunburst. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-sunburst severity="error"></dt-sunburst>
  `,
})
class TestApp {}

/** Test component that is not visible by default. */
@Component({
  selector: 'dt-test-app-empty',
  template: `
    <dt-sunburst></dt-sunburst>
  `,
})
class TestAppEmpty {}
