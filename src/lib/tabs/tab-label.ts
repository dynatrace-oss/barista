import { TemplateRef, ViewContainerRef, Directive } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[dtTabLabel]',
  exportAs: 'dtTabLabel',
})
export class DtTabLabel extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}
