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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtTagModule } from './tag-module';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtTag', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtTagModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [TestAppSimple, TestAppRemovable],
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

  it('should not be removable', () => {
    const fixture = createComponent(TestAppSimple);
    fixture.detectChanges();

    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeFalsy();
  });

  it('should be removable', () => {
    const fixture = createComponent(TestAppRemovable);
    fixture.detectChanges();

    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-tag dt-icon');
    expect(tileNativeElement).toBeTruthy();
  });

  it('should fire removed event', () => {
    const fixture = createComponent(TestAppRemovable);
    fixture.detectChanges();

    const item = fixture.debugElement.nativeElement.querySelector('dt-icon');

    expect(fixture.componentInstance.removeEventCount).toBe(0);

    item.click();

    expect(fixture.componentInstance.removeEventCount).toBe(1);
  });
});

/** Test component that contains an DtTag. */
@Component({
  selector: 'dt-test-app',
  template: ` <dt-tag>Value</dt-tag> `,
})
class TestAppSimple {}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tag removable (removed)="increaseEventCount()">Value</dt-tag>
  `,
})
class TestAppRemovable {
  removeEventCount = 0;

  increaseEventCount(): void {
    this.removeEventCount++;
  }
}
