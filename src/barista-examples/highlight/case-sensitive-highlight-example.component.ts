import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  styles: ['input { margin-bottom: 20px; }'],
  template: `
    <input type="text" dtInput value="Dy" #search />
    <dt-highlight [term]="search.value" caseSensitive>Dynatrace system Monitoring</dt-highlight>
  `,
})
export class CaseSensitiveHighlightExampleComponent { }
