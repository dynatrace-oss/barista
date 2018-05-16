import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-tag interactive>Interactive tag</dt-tag>
<a dtTag interactive routerLink="/">Interactive tag on a link</a>`,
})
export class PlainInteractiveTagExampleComponent { }
