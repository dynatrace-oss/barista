import { Component } from '@angular/core';

@Component({
  selector: 'dt-<%= dasherize(name) %>-ui-test',
  templateUrl: '<%= dasherize(name) %>-ui.html',
})
export class <%= classify(name) %>UI {}
