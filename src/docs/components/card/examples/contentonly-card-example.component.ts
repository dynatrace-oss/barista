import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <div class="demo-card">
<dt-card>
  This is some generic content
</dt-card></div>`,
})
@OriginalClassName('ContentOnlyCardExampleComponent')
export class ContentOnlyCardExampleComponent { }
