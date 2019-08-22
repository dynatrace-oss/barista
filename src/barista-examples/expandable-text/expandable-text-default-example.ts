import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    With automatic monitoring enabled, you can create rules that define
    exceptions to automatic process detection and monitoring. With automatic
    monitoring disabled, you can define rules that identify specific processes
    that should be monitored. Rules are applied in the order listed below.
    <dt-expandable-text label="More..." labelClose="Less">
      This means that you can construct complex operations for fine-grain
      control over the processes that are monitored in your environment. For
      example, you might define an inclusion rule that’s followed by an
      exclusion rule covering the same process.
    </dt-expandable-text>
  `,
})
export class ExpandableTextDefaultExample {}
