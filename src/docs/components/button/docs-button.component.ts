import { Component } from '@angular/core';
import { AllButtonExampleComponent } from './examples/button-all-example.component';
import { SimpleButtonExampleComponent } from './examples/button-simple-example.component';
import { InteractionButtonExampleComponent } from './examples/button-interaction-example.component';
import { VariantButtonExampleComponent } from './examples/button-variant-example.component';
import { ColorButtonExampleComponent } from './examples/button-color-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-button',
  styleUrls: ['./docs-button.component.scss'],
  templateUrl: './docs-button.component.html',
})
export class DocsButtonComponent {

  examples = {
    simple: SimpleButtonExampleComponent,
    interaction: InteractionButtonExampleComponent,
    variant: VariantButtonExampleComponent,
    color: ColorButtonExampleComponent,
    all: AllButtonExampleComponent,
  };
}
