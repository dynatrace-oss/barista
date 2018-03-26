import { ComponentPortal } from "@angular/cdk/portal";
import { Component, Input, Type } from "@angular/core";
import { TemplateRetriever } from "../../core/TemplateRetriever";

@Component({
  selector: "docs-source-example",
  styles: [`
    .portal {
      margin-top: 20px;
    }

    .code {
      max-height: 300px;
      overflow-x: auto;
      margin: 0;
    }

    .toggle {
      margin-top: 5px;
    }
  `],
  template: `
    <ng-container [portalHost]="portal" class="portal"></ng-container>
    <div class="toggle">
      <a *ngIf="!codeVisible" (click)="codeVisible = true">Show source</a>
      <a *ngIf="codeVisible" (click)="codeVisible = false">Hide source</a>
    </div>
    <pre class="code" *ngIf="codeVisible"><code [docsSnippet]="source" [language]="['html', 'typescript']"></code></pre>
  `,
})
export class SourceExampleComponent {

  public source = "";
  public codeVisible = false;
  public portal: ComponentPortal<{}>;

  @Input()
  public set example(component: Type<{}>) {
    // tslint:disable-next-line:no-inferred-empty-object-type
    this.portal = new ComponentPortal(component);
    this.source = TemplateRetriever.fromComponent(component);
  }
}
