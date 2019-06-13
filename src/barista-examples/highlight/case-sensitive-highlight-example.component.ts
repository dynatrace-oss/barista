import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  styles: ['input { margin-bottom: 20px; }'],
  template: `
    <input type="text" dtInput value="Dy" #search aria-label="Insert the text that should be highlighted in the example below." />
    <dt-highlight [term]="search.value" caseSensitive>Dynatrace system Monitoring</dt-highlight>
  `,
})
export class CaseSensitiveHighlightExampleComponent { }
