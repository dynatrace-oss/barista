import { Component } from '@angular/core';
import { Default<%= classify(name) %>ExampleComponent } from './examples/default-<%= dasherize(name) %>-example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>.component.html',
  styleUrls: ['<%=dasherize(name)%>.component.scss'],
})
export class <%= classify(name) %>Demo {
  examples = {
    default: Default<%= classify(name) %>ExampleComponent,
  };
}
