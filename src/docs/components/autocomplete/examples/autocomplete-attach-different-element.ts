import { Component, OnInit } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  template: `
  <div dtAutocompleteOrigin #origin="dtAutocompleteOrigin">
    <input dtInput
      [dtAutocomplete]="auto" [dtAutocompleteConnectedTo]="origin"
      [formControl]="myControl"
      placeholder="Start typing">
    <span>Some text to make the wrapper bigger</span>
  </div>
  <dt-autocomplete #auto="dtAutocomplete">
    <dt-option *ngFor="let option of filteredOptions | async" [value]="option">{{option}}</dt-option>
  </dt-autocomplete>
  `,
})
@OriginalClassName('AttachDifferentElementAutocompleteExample')
export class AttachDifferentElementAutocompleteExample implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
}
