import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DocsButtonComponent } from "./docs-button/docs-button.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "button",
  },
  {
    component: DocsButtonComponent,
    path: "button",
  },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class DocsComponentsRoutingModule { }
