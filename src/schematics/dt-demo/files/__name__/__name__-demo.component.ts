import { Component } from '@angular/core';

@Component({
  selector: 'alert-demo',
  templateUrl: './<%= name %>-demo.component.html',
  styleUrls: ['./<%= name %>-demo.component.scss'],
})
export class <%= classify(name)%>Demo {

}
