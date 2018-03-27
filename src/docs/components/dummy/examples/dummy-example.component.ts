import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  // inline template for now - create pre build gulp task to inline templateUrls and move template to html
  template: `<div dtDummy>Dummy</div>`,
})
export class DummyExampleComponent {
}
