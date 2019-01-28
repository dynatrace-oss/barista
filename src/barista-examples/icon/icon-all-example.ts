import {
  Component,
  Input,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DtIconType } from '@dynatrace/dt-iconpack';
import { Viewport } from './viewport';

@Component({
  moduleId: module.id,
  selector: 'docs-async-icon',
  template: `
    <ng-container *ngIf="show">
      <dt-icon [name]="name"></dt-icon>
      <p>{{name}}</p>
    </ng-container>
  `,
  styles: ['dt-icon { display: inline-block; width: 3rem; height: 3rem; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsAsyncIcon implements OnDestroy {
  @Input() name: DtIconType;
  @Input() show: boolean;

  private _viewportEnterSub: Subscription;

  constructor(viewport: Viewport, el: ElementRef, changeDetector: ChangeDetectorRef) {
    if (!this.show) {
      this._viewportEnterSub = viewport.elementEnter(el)
        .pipe(take(1))
        .subscribe(() => {
          this.show = true;
          changeDetector.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    if (this._viewportEnterSub) {
      this._viewportEnterSub.unsubscribe();
    }
  }
}

@Component({
  moduleId: module.id,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input #input type="text" dtInput placeholder="Filter by" (input)="deferUpdateSubscription()"/>
    <div class="all-icons-container">
      <docs-async-icon *ngFor="let name of icons; let i = index" [name]="name" [show]="i < 25"></docs-async-icon>
    </div>`,
  styles: [
    `.all-icons-container {
      display: grid;
      grid-auto-columns: max-content;
      grid-gap: 10px;
      max-width: 800px;
      grid-template-columns: repeat(auto-fill, minmax(min-content, 200px));
    }`,
    'docs-async-icon { display: inline-block; padding: 1.5rem; text-align: center; }',
  ],
})
export class AllIconExample implements OnInit {

  @ViewChild('input') _inputEl: ElementRef;
  private _iconSubscription: Subscription = Subscription.EMPTY;
  private _timeout;
  @Input() icons: string[];
  constructor(private _httpClient: HttpClient, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.updateSubscription();
  }

  private deferUpdateSubscription(): void {
    clearTimeout(this._timeout);
    // tslint:disable-next-line: no-magic-numbers
    this._timeout = setTimeout(() => this.updateSubscription(), 200);
  }

  private updateSubscription(): void {
    const filterText = this._inputEl.nativeElement.value || '';
    this._iconSubscription.unsubscribe();
    this._iconSubscription = this._httpClient
      .get('/assets/icons/metadata.json')
      .pipe(
        map((res: { icons: string[] }) => res.icons)
      )
      .subscribe((icons: string[]) => {
        this.icons = icons.filter((value: string) => filterText === '' || value.indexOf(filterText) !== -1);
        this.changeDetector.detectChanges();
      });
  }
}
