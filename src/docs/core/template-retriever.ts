import { Type } from '@angular/core';
import { AnnotationRetriever } from './annotation-retriever';

// tslint:disable-next-line:no-unnecessary-class
export class TemplateRetriever {

  static fromComponent(component: Type<{}>): string {
    const annotations = AnnotationRetriever.getAnnotation(component);
    if (!annotations) {
      throw new Error(`Failed to retrieve annotations from component ${component.name}`);
    }
    if (!annotations.template) {
      throw new Error(`Empty template of component ${component.name}`);
    }

    return annotations.template;
  }
}
