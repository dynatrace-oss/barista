import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '<%=dasherize(name)%>-demo',
  templateUrl: '<%=dasherize(name)%>-demo.html',
  styleUrls: ['<%=dasherize(name)%>-demo.css'],
})
export class <%= classify(name) %>Demo {
}
