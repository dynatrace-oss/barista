import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <section class="dark" dtTheme=":dark">
      <input type="text" dtInput placeholder="Please insert text" />
      <textarea dtInput placeholder="Please insert text"></textarea>
    </section>`,
  styles: ['textarea { margin-top: 8px; }'],
})
export class DarkInputExample { }
