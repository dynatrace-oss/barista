// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component, ViewChild } from '@angular/core';
// import { By } from '@angular/platform-browser';
import { DtTableModule, DtTable } from '@dynatrace/angular-components/table';

describe('DtTable', () => {

  // beforeEach(async(() => {
  //   TestBed.configureTestingModule({
  //     imports: [DtTableModule],
  //     declarations: [TestApp],
  //   });

  //   TestBed.compileComponents();
  // }));

  describe('Create DtTable', () => {
    // it('Should render a TableComponent', () => {
    //   const fixture = TestBed.createComponent(TestApp);
    //   expect(fixture.componentInstance.tableComponent).toBeTruthy();
    // });
    it('dummy test', () => {
      expect(0).toBe(1);
    });
  });

});

// /** Test component that contains a DtTable. */
// @Component({
//   selector: 'dt-test-app',
//   template: `
//   <dt-table [dataSource]="dataSource">
//     <ng-container dtColumnDef="col1">
//       <dt-header-cell *dtHeaderCellDef>column 1</dt-header-cell>
//       <dt-cell *dtCellDef="let row">{{row.col1}}</dt-cell>
//     </ng-container>

//     <ng-container dtColumnDef="col2">
//       <dt-header-cell *dtHeaderCellDef>column 2</dt-header-cell>
//       <dt-cell *dtCellDef="let row">{{row.col2}}</dt-cell>
//     </ng-container>

//     <dt-header-row *dtHeaderRowDef="['col1', 'col2']"></dt-header-row>
//     <dt-row *dtRowDef="let row; columns: ['col1', 'col2']"></dt-row>
// </dt-table>
//   `,
// })
// class TestApp {
//   @ViewChild(DtTable) tableComponent: DtTable<object[]>;

//   dataSource = [
//     {col1: 'test 1', col2: 'test 2'},
//     {col1: 'test 1', col2: 'test 2'},
//     {col1: 'test 1', col2: 'test 2'},
//     {col1: 'test 1', col2: 'test 2'},
//   ];
// }
