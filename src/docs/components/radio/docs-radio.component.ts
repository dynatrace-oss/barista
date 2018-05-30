import { Component } from '@angular/core';
import { DefaultRadioExample } from './examples/default-radio-example';
import { NameGroupingRadioExample } from './examples/name-grouping-radio-example';
import { DarkRadioExample } from './examples/dark-radio-example';

@Component({
  moduleId: module.id,
  selector: 'docs-radio',
  templateUrl: 'docs-radio.component.html',
  styleUrls: ['docs-radio.component.scss'],
})
export class DocsRadioComponent {
  examples = {
    default: DefaultRadioExample,
    nameGrouping: NameGroupingRadioExample,
    dark: DarkRadioExample,
  };
}
