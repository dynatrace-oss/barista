import { Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'ba-page-content',
  template: '',
})
export class BaPageContent {
  @Input()
  get data(): string {
    return this._data;
  }
  set data(value: string) {
    this._data = value;
    // TODO: is this okay?
    // tslint:disable-next-line dt-ban-inner-html
    this._elementRef.nativeElement.innerHTML = value;
    this._elementRef.nativeElement.setAttribute('id', 'all-content');
  }
  private _data = '';

  constructor(private _elementRef: ElementRef<HTMLElement>) {}
}
