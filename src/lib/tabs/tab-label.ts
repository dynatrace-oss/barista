import { TemplateRef, ViewContainerRef, Directive } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[dt-tab-label]',
  exportAs: 'dtTabLabel',
  host: {
    class: 'dt-tab-label',
  },
})
export class DtTabLabel extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}
