import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <form>
      <dt-form-field>
        <dt-label>Name</dt-label>
        <input
          type="text"
          dtInput
          placeholder="John Smith"
          aria-label="Please insert your full name"
        />
      </dt-form-field>
      <dt-form-field>
        <dt-label>Email address</dt-label>
        <input
          type="email"
          dtInput
          placeholder="john@smith.com"
          aria-label="Please insert your email address"
        />
      </dt-form-field>
      <button dt-button>Save</button>
    </form>
  `,
  styles: ['.dt-form-field { margin-bottom: 20px; }'],
})
export class InputFormExample {}
