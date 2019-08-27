// tslint:disable:max-line-length
import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <button
      dt-icon-button
      aria-label="An example button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <a
      dt-icon-button
      href="#"
      aria-label="An example button containing a proxy icon"
    >
      <dt-icon name="proxy"></dt-icon>
    </a>
    <button
      dt-icon-button
      variant="secondary"
      aria-label="An example secondary button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      variant="nested"
      aria-label="An example nested button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="warning"
      aria-label="An example warning button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="warning"
      variant="secondary"
      aria-label="An example warning button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="warning"
      variant="nested"
      aria-label="An example warning button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="cta"
      aria-label="An example CTA button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="cta"
      variant="secondary"
      aria-label="An example CTA button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <button
      dt-icon-button
      color="cta"
      variant="nested"
      aria-label="An example CTA button containing an agent icon"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class ButtonIconOnlyExample {}
// tslint:enable:max-line-length
