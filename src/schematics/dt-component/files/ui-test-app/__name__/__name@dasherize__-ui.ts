import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-<%= dasherize(name) %>-ui',
  templateUrl: '<%= dasherize(name) %>-ui.html',
})
export class <%= classify(name) %>UI {

}
