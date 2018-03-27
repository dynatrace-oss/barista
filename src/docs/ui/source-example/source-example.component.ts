import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, Type } from '@angular/core';
import { TemplateRetriever } from '../../core/template-retriever';

@Component({
  moduleId: module.id,
  selector: 'source-example',
  styleUrls: ['source-example.component.css'],
  templateUrl: 'source-example.component.html',
})
export class SourceExampleComponent {

  source = '';
  codeVisible = false;
  portal: ComponentPortal<{}>;

  @Input()
  set example(component: Type<{}>) {
    // tslint:disable-next-line:no-inferred-empty-object-type
    this.portal = new ComponentPortal(component);
    this.source = TemplateRetriever.fromComponent(component);
  }
}
