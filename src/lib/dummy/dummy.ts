import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dt-dummy',
  styleUrls: ['./dummy.scss'],
  templateUrl: './dummy.html',
  exportAs: 'dtDummy',
})
export class DtDummy implements OnInit {
  ngOnInit(): void {
    // tslint:disable-next-line:no-console
    console.log('dummy');
  }
}
