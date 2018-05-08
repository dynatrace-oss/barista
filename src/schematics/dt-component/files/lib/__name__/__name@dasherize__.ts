import {
  Directive,
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'gh-<%=dasherize(name)%>',
  templateUrl: '<%=dasherize(name)%>.html',
  styleUrls: ['<%=dasherize(name)%>.css'],
  host: {
    'class': 'gh-<%=dasherize(name)%>',
  },
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gh<%= classify(name) %> {

}
