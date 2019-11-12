import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'demo-component-barista-example',
  template: `
    <div dtAutocompleteOrigin #origin="dtAutocompleteOrigin">
      <input
        dtInput
        [dtAutocomplete]="auto"
        [dtAutocompleteConnectedTo]="origin"
        [formControl]="myControl"
        placeholder="Start typing"
        aria-label="Start typing"
      />
      <span>Some text to make the wrapper bigger</span>
    </div>
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </dt-option>
    </dt-autocomplete>
  `,
})
export class AutocompleteAttachDifferentElementExample implements OnInit {
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue),
    );
  }
}
