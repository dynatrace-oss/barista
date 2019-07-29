import { Component } from '@angular/core';

@Component({
  selector: '<%= dasherize(name) %>-demo',
  templateUrl: './<%= name %>-demo.component.html',
  styleUrls: ['./<%= name %>-demo.component.scss'],
})
export class <%= classify(name) %>Demo {

}
