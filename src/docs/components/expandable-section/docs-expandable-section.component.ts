import { Component } from '@angular/core';
import {DefaultExpandableSectionExampleComponent} from './examples/expandable-section-default-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-expandable-section',
  styleUrls: ['./docs-expandable-section.component.scss'],
  templateUrl: './docs-expandable-section.component.html',
})
export class DocsExpandableSectionComponent {

  examples = {
    default: DefaultExpandableSectionExampleComponent
  };
}
