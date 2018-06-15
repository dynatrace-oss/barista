import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  moduleId: module.id,
  template: `<div class="all-icons-container">
  <div *ngFor="let name of icons$ | async" class="icon">
    <dt-icon [name]="name"></dt-icon>
    <p>{{name}}</p>
  </div>
  </div>`,
  styles: [
    `.all-icons-container {
      display: grid;
      grid-auto-columns: max-content;
      grid-gap: 10px;
      grid-template-columns: repeat(auto-fill, minmax(min-content, 200px));
    }`,
    '.icon { display: inline-block; padding: 1.5rem; text-align: center; }',
    'dt-icon { display: inline-block; width: 3rem; height: 3rem; }',
  ],
})
export class AllIconExample {

  icons$: Observable<string[]>;
  constructor(private _httpClient: HttpClient) {
    this.icons$ = this._httpClient.get('assets/icons/metadata.json').pipe(map((res: { icons: string[]}) => res.icons));
  }
}
