import {
  Component,
  Input,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
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
  template: `
    <input #input type="text" dtInput placeholder="Filter by" (input)="_onInputChange($event)"/>
    <div class="all-icons-container">
      <docs-async-icon *ngFor="let name of _icons; let i = index" [name]="name" [show]="i < 25"></docs-async-icon>
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
export class AllIconExample implements OnDestroy {

  @ViewChild('input') _inputEl: ElementRef;
  _icons: string[];

  private _iconData: string[];
  private _iconSubscription: Subscription = Subscription.EMPTY;

  constructor(private _httpClient: HttpClient, private changeDetector: ChangeDetectorRef) {
    this._iconSubscription = this._httpClient
      .get('/assets/icons/metadata.json')
      .pipe(
        map((res: { icons: string[] }) => res.icons)
      )
      .subscribe((icons: string[]) => {
        this._iconData = icons;
        this._applyFilter();
      });
  }

  ngOnDestroy(): void {
    this._iconSubscription.unsubscribe();
  }

  _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
    this._applyFilter();
  }

  private _applyFilter(): void {
    const filterText = this._inputEl.nativeElement.value || '';
    this._icons = this._iconData.filter((value: string) => filterText === '' || value.indexOf(filterText) !== -1)
    this.changeDetector.detectChanges();
  }
}
