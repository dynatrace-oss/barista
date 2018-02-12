import { NgModule } from "@angular/core";

import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { AngularComponentsModule } from "../../components";
import { SnippetDirective } from "./snippet/snippet.directive";
import { SourceExampleComponent } from "./source-example/source-example.component";
import { VariantsTableComponent } from "./variants-table/variants-table.component";

@NgModule({
  declarations: [
    SnippetDirective,
    SourceExampleComponent,
    VariantsTableComponent,
  ],
  exports: [
    SnippetDirective,
    SourceExampleComponent,
    VariantsTableComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    PortalModule,
    AngularComponentsModule,
  ],
})
export class UiModule {
}
