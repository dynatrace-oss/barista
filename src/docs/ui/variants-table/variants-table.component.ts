import { Component, ContentChildren, QueryList, TemplateRef } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "docs-variants-table",
  styleUrls: ["./variants-table.component.scss"],
  template: `
    <table class="table">
      <thead *ngIf="headers.length">
      <tr>
        <td *ngFor="let elRef of headers">
          <ng-container *ngTemplateOutlet="elRef"></ng-container>
        </td>
      </tr>
      </thead>
      <tr *ngFor="let bg of BACKGROUNDS_COLLECTION" [ngClass]="{'theme--dark': bg >= 2}">
        <td *ngFor="let elRef of variants">
          <ng-container *ngTemplateOutlet="elRef"></ng-container>
        </td>
      </tr>
    </table>
  `,
})
export class VariantsTableComponent {

  public readonly BACKGROUNDS_NO: number = 5;
  public readonly BACKGROUNDS_COLLECTION: number[] = _.range(this.BACKGROUNDS_NO);

  @ContentChildren("variant")
  public variants: QueryList<TemplateRef<{}>>;

  @ContentChildren("header")
  public headers: QueryList<TemplateRef<{}>>;
}
