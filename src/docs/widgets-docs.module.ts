import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { DocsIndexComponent } from "./docs-index.component";
import { WidgetsDocsRoutingModule } from "./widgets-docs-routing.module";
import { WidgetsDocsComponent } from "./widgets-docs.component";

@NgModule({
  bootstrap: [WidgetsDocsComponent],
  declarations: [
    DocsIndexComponent,
    WidgetsDocsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    WidgetsDocsRoutingModule,
  ],
})
export class WidgetsDocsModule {
}
