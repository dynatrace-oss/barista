import { Component, OnInit, AfterViewInit, ViewChild, ContentChild } from '@angular/core';
import { HeaderRowPlaceholder } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'docs-table',
  styleUrls: ['./docs-table.component.scss'],
  templateUrl: './docs-table.component.html'
})
export class DocsTableComponent implements AfterViewInit {
  public dataSource1: object[] = [
    {id: 1, host: 'dynamic.host.net', ip: '109.235.113.1' },
    {id: 2, host: 'svsreut.host.net', ip: '46.175.98.251' },
    {id: 3, host: 'adsl.host.net', ip: '113.205.238.171' },
    {id: 4, host: 'static.host.net', ip: '114.95.146.41' },
    {id: 5, host: 'iaccc.host.net', ip: '101.85.108.201' },
    {id: 6, host: 'qubee.host.net', ip: '200.215.253.191' },
    {id: 7, host: 'gvt.host.net', ip: '59.65.184.61' },
    {id: 8, host: 'augere.host.net', ip: '177.135.199.211' },
  ];

  @ViewChild(HeaderRowPlaceholder) _headerRowPlaceholder: HeaderRowPlaceholder;

  constructor() { }

  ngAfterViewInit() {
    console.log('test', this._headerRowPlaceholder);
  }

}
