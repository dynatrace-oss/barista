import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <input
      dtInput
      [dtAutocomplete]="auto"
      [formControl]="myControl"
      placeholder="Start typing"
      aria-label="Start typing"
    />
    <dt-autocomplete #auto="dtAutocomplete" autoActiveFirstOption>
      <dt-option
        *ngFor="let option of filteredOptions | async"
        [value]="option"
      >
        {{ option }}
      </dt-option>
    </dt-autocomplete>
  `,
})
export class AutocompleteHighlightFirstOptionExample implements OnInit {
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
