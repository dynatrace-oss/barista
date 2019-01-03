import { Component } from '@angular/core';

@Component({
  selector: 'autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
  styleUrls: ['./autocomplete-demo.component.scss'],
})
export class AutocompleteDemo {
  value: string;
  options: string[] = ['One', 'Two', 'Three'];
}
