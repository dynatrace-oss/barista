import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<div class="demo-card">
<dt-card>
  <dt-card-title>Top 3 JavaScript errors</dt-card-title>
  This is some generic content
  <dt-card-footer-actions>
    <button dt-button variant="secondary">Analyse response time</button>
    <button dt-button variant="primary">Details</button>
  </dt-card-footer-actions>
</dt-card></div>`,
  styles: ['.dt-button + .dt-button { margin-left: 8px;}; }'],
})
@OriginalClassName('TitleCardExampleComponent')
export class TitleCardExampleComponent { }
