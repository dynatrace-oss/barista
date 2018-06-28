import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-<%= component %>></dt-<%= component %>>',
})
@OriginalClassName('<%=exampleComponentName%>')
export class <%=exampleComponentName%> { }
