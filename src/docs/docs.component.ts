import { Component } from '@angular/core';

/**
 * Home component for welcome message in DocsApp.
 */
@Component({
  selector: 'home',
  template: `
  <h1>Dynatrace angular components library</h1>
  <p>Choose component from the left menu to see its documentation.<p>
  <h2>Links</h2>
  <ul class="list">
    <li>
      <a href="***REMOVED***
        Repository
      </a>
    </li>
    <li>
      <a href="***REMOVED*** styles</a>
      - latest style guide
    </li>
  </ul>
  `,
})
export class Home {}

@Component({
  selector: 'docs',
  styleUrls: ['docs.component.css'],
  templateUrl: 'docs.component.html',
})
export class Docs {
  navItems = [
    {name: 'Start', route: '/'},
    {name: 'Dummy', route: '/dummy'},
  ];
}
