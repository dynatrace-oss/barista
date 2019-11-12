import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: '<%= dasherize(name) %>-dev-app-demo',
  templateUrl: '<%= dasherize(name) %>-demo.component.html',
  styleUrls: ['<%= dasherize(name) %>-demo.component.scss'],
})
export class <%= classify(name) %>Demo {}
