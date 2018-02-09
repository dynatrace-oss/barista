import { Type } from "@angular/core";
import { AnnotationRetriever } from "./AnnotationRetriever";

export class TemplateRetriever {

  public static fromComponent(component: Type<{}>): string {
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
