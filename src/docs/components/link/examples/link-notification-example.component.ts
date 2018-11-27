import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  template: `
    <div class="notification">
      A new Dynatrace ActiveGate is available for you. <a class="dt-link">Upgrade now</a> to make sure you benefit from all the <a class="dt-link dt-external">new features and improvements</a>
    </div>
  `,
  styles: [
    '.notification { font-size: 16px; }',
  ],
})
@OriginalClassName('LinkNotificationExampleComponent')
export class LinkNotificationExampleComponent {
}
