import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <input
      dtInput
      [dtAutocomplete]="auto"
      [(ngModel)]="value"
      placeholder="Start typing"
      aria-label="Start typing"
    />
    <dt-autocomplete #auto="dtAutocomplete">
      <dt-option *ngFor="let option of options" [value]="option">
        {{ option }}
      </dt-option>
    </dt-autocomplete>
  `,
})
export class DefaultAutocompleteExample {
  value: string;
  options: string[] = ['One', 'Two', 'Three'];
}
