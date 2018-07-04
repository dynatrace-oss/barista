import { Type } from '@angular/core';
import { DtLogger, DtLoggerFactory } from '@dynatrace/angular-components';
import { AnnotationRetriever } from './annotation-retriever';

const LOG: DtLogger = DtLoggerFactory.create('TemplateRetriever');

// tslint:disable-next-line:no-unnecessary-class
export class TemplateRetriever {

  static fromComponent(component: Type<{}>): string {
    const annotations = AnnotationRetriever.getAnnotation(component);
    if (!annotations) {
      LOG.warn(`Failed to retrieve annotations from component ${component.name}. These are only available in JIT mode.`);
    } else if (!annotations.template) {
      LOG.warn(`Empty template of component ${component.name}`);
    } else {
      return annotations.template;
    }
    return '';
  }
}
