import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  styleUrls: ["./widgets-docs.component.scss"],
  template: `
    <div class="nav has-no-secondary">
      <a class="nav__brand" routerLink="/">
      </a>
    </div>
    <div class="layout is-flex">
      <nav class="sidebar">
        <div class="headline">Basic</div>
        <a routerLink="/components/button" class="sidebar__item" routerLinkActive="is-current">
          <span class="sidebar__headline">Button</span>
        </a>
        <a routerLink="/components/checkbox" class="sidebar__item" routerLinkActive="is-current">
          <span class="sidebar__headline">Checkbox</span>
        </a>
        <a routerLink="/components/switch" class="sidebar__item" routerLinkActive="is-current">
          <span class="sidebar__headline">Switch</span>
        </a>
        <a routerLink="/components/radiobutton" class="sidebar__item" routerLinkActive="is-current">
            <span class="sidebar__headline">Radio-button</span>
        </a>
      </nav>
      <div class="island island--connected">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class WidgetsDocsComponent {
}
