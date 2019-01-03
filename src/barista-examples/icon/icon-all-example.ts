import { Component, Input, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { DtIconType } from '@dynatrace/dt-iconpack';
import { Viewport } from './viewport';

@Component({
  moduleId: module.id,
  selector: 'docs-async-icon',
  template: `
    <ng-container *ngIf="_show">
      <dt-icon [name]="name"></dt-icon>
      <p>{{name}}</p>
    </ng-container>
  `,
  styles: ['dt-icon { display: inline-block; width: 3rem; height: 3rem; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsAsyncIcon implements OnDestroy {
  @Input() name: DtIconType;

  _show = false;
  private _viewportEnterSub: Subscription;

  constructor(viewport: Viewport, el: ElementRef, changeDetector: ChangeDetectorRef) {
    this._viewportEnterSub = viewport.elementEnter(el)
      .pipe(take(1))
      .subscribe(() => {
        this._show = true;
        changeDetector.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this._viewportEnterSub) {
      this._viewportEnterSub.unsubscribe();
    }
  }
}

@Component({
  moduleId: module.id,
  template: `<div class="all-icons-container">
    <docs-async-icon *ngFor="let name of icons$ | async" [name]="name" class="icon"></docs-async-icon>
  </div>`,
  styles: [
    `.all-icons-container {
      display: grid;
      grid-auto-columns: max-content;
      grid-gap: 10px;
      grid-template-columns: repeat(auto-fill, minmax(min-content, 200px));
    }`,
    '.icon { display: inline-block; padding: 1.5rem; text-align: center; }',
  ],
})
export class AllIconExample {

  icons$: Observable<string[]>;
  constructor(private _httpClient: HttpClient) {
    this.icons$ = this._httpClient
      .get('/assets/icons/metadata.json')
      .pipe(
        map((res: { icons: string[] }) => res.icons)
      );
  }
}
