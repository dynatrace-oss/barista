import { Component } from '@angular/core';
import { DefaultOverlayExampleComponent } from './examples/default-overlay-example.component';
import { TimelineOverlayExampleComponent } from './examples/timeline-overlay-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-overlay',
  templateUrl: 'docs-overlay.component.html',
  styleUrls: ['docs-overlay.component.scss'],
})
export class DocsOverlayComponent {
  examples = {
    default: DefaultOverlayExampleComponent,
    timeline: TimelineOverlayExampleComponent,
  };
}
