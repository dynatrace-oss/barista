import { Component } from '@angular/core';
import { LinkDarkExampleComponent } from './examples/link-dark-example.component';
import { LinkExternalExampleComponent } from './examples/link-external-example.component';
import { LinkSimpleExampleComponent } from './examples/link-simple-example.component';

@Component({
  selector: 'docs-link',
  templateUrl: './docs-link.component.html',
  styleUrls: ['./docs-link.component.css'],
})
export class DocsLinkComponent {

  examples = {
    external: LinkExternalExampleComponent,
    simple: LinkSimpleExampleComponent,
    dark: LinkDarkExampleComponent,
  };
}
