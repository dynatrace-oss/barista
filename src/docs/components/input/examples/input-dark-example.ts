import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <section class="dark" dtTheme=":dark">
      <p>
        <input type="text" dtInput #input placeholder="Please insert text" value="Text" />
        <textarea dtInput #textarea placeholder="Please insert text">Text</textarea>
      </p>
      <button dt-button (click)="input.disabled = !input.disabled; textarea.disabled = !textarea.disabled">Toggle disabled</button>
    </section>`,
  styles: ['textarea { margin-top: 8px; }'],
})
@OriginalClassName('DarkInputExample')
export class DarkInputExample { }
