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

import { Component, ViewChild } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { _DtTableBaseModule, _DtTableBase } from './base-table';
import { DtTableModule } from './table-module';

describe('_DtTableInteractiveRows', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [_DtTableBaseModule, DtTableModule],
        declarations: [TestApp, AttributeTestApp],
      });

      TestBed.compileComponents();
    }),
  );

  it('should take the interactiveRows via a binding', () => {
    const fixture = TestBed.createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;

    expect(testComponent.table.interactiveRows).toBe(false);

    testComponent.interactiveRows = true;
    fixture.detectChanges();

    expect(testComponent.table.interactiveRows).toBe(true);
  });

  it('should take the interactiveRows via an attribute', () => {
    const fixture = TestBed.createComponent(AttributeTestApp);
    const testComponent = fixture.debugElement.componentInstance;

    expect(testComponent.table.interactiveRows).toBe(true);
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table-base [interactiveRows]="interactiveRows">
      <ng-container dtColumnDef="memory"></ng-container>
      <dt-row *dtRowDef="let row; columns: ['memory']"></dt-row>
    </dt-table-base>
  `,
})
class TestApp {
  interactiveRows: boolean;
  @ViewChild(_DtTableBase, { static: true }) table: _DtTableBase<any>;
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-table-base interactiveRows>
      <ng-container dtColumnDef="memory"></ng-container>
      <dt-row *dtRowDef="let row; columns: ['memory']"></dt-row>
    </dt-table-base>
  `,
})
class AttributeTestApp {
  @ViewChild(_DtTableBase, { static: true }) table: _DtTableBase<any>;
}
