import { Component } from '@angular/core';
import { Default<%= classify(name) %>ExampleComponent } from './examples/default-<%= dasherize(name) %>-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-<%=dasherize(name)%>',
  templateUrl: 'docs-<%=dasherize(name)%>.component.html',
  styleUrls: ['docs-<%=dasherize(name)%>.component.scss'],
})
export class <%= docsComponent %> {
  examples = {
    default: Default<%= classify(name) %>ExampleComponent,
  };
}
