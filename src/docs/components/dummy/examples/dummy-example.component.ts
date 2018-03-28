import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  // inline template for now - create pre build gulp task to inline templateUrls and move template to html
  template: `<dt-dummy>Dummy</dt-dummy>`,
})
export class DummyExampleComponent {
}
