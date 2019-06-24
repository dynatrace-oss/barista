import { Component } from '@angular/core';

// tslint:disable:max-line-length
@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-checkbox>Check this checkbox to subscribe to our product news newsletter and other updates. We'll send updates once a month and promise we won't spam you.</dt-checkbox>
<dt-checkbox>This website uses performance, functionality and targeting cookies. If you check this checkbox, you consent to the use of cookies.</dt-checkbox>
`,
  styles: [`
    dt-checkbox {
      display: block;
    }
    dt-checkbox + dt-checkbox {
      margin-top: 20px;
    }
  `],
})
export class ResponsiveCheckboxExampleComponent { }
// tslint:enable:max-line-length
