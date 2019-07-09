// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { TestBed, async } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { _DtTableBase } from '@dynatrace/angular-components';
import { _DtTableBaseModule } from './base-table';
import { DtTableModule } from './table-module';

describe('_DtTableInteractiveRows', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [_DtTableBaseModule, DtTableModule],
      declarations: [TestApp, AttributeTestApp],
    });

    TestBed.compileComponents();
  }));

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
