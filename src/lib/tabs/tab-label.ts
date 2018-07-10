import { TemplateRef, ViewContainerRef, Directive } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

/**
 * Directive to be able to render the given label inside the portaloutlet
 */
@Directive({
  selector: '[dtTabLabel]',
  exportAs: 'dtTabLabel',
})
export class DtTabLabel extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }
}
