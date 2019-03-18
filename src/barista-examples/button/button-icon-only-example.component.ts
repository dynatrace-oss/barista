// tslint:disable:max-line-length
import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
    <button dt-icon-button aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <a dt-icon-button href="#" aria-label="A disabled example button containing an agent icon"><dt-icon name="proxy"></dt-icon></a>
    <button dt-icon-button variant="secondary" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button variant="nested" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning" variant="secondary" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="warning" variant="nested" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta" variant="secondary" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
    <button dt-icon-button color="cta" variant="nested" aria-label="A disabled example button containing an agent icon"><dt-icon name="agent"></dt-icon></button>
  `,
  styles: ['.dt-button + .dt-button { margin-left: 8px; }'],
})
export class IconOnlyButtonExampleComponent {}
// tslint:enable:max-line-length
