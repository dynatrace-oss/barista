import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DocsIndexComponent } from "./docs-index.component";

const routes: Routes = [
  {
    loadChildren: "./docs-components/docs-components.module#DocsComponentsModule",
    path: "components",
  },
  {
    component: DocsIndexComponent,
    path: "",
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class WidgetsDocsRoutingModule {
}
