import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Input, Type } from '@angular/core';
import { TemplateRetriever } from '../../core/template-retriever';

@Component({
  moduleId: module.id,
  selector: 'docs-source-example',
  styleUrls: ['source-example.component.scss'],
  templateUrl: 'source-example.component.html',
})
export class SourceExampleComponent {

  source = '';
  codeVisible = false;
  portal: ComponentPortal<{}>;

  @Input()
  set componentType(component: Type<{}>) {
    // tslint:disable-next-line:no-inferred-empty-object-type
    this.portal = new ComponentPortal(component);
    this.source = TemplateRetriever.fromComponent(component);
  }
}
