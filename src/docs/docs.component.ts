import { Component, HostListener } from '@angular/core';
import { LocationService } from './core/location.service';
import { DocumentService, DocumentContents } from './core/document.service';

@Component({
  selector: 'docs-app',
  styleUrls: ['docs.component.scss'],
  templateUrl: 'docs.component.html',
})
export class Docs {
  navItems = [
    { name: 'Alert', route: '/alert' },
    { name: 'Autocomplete', route: '/autocomplete' },
    { name: 'Breadcrumbs', route: '/breadcrumbs' },
    { name: 'Button', route: '/button' },
    { name: 'Button Group', route: '/button-group' },
    { name: 'Card', route: '/card' },
    { name: 'Chart', route: '/chart' },
    { name: 'Checkbox', route: '/checkbox' },
    { name: 'Context dialog', route: '/context-dialog' },
    { name: 'Copy To Clipboard', route: '/copy-to-clipboard' },
    { name: 'Expandable panel', route: '/expandable-panel' },
    { name: 'Expandable section', route: '/expandable-section' },
    { name: 'Font styling', route: '/style#fonts' },
    { name: 'Formatters', route: '/formatters' },
    { name: 'Filter field', route: '/filter-field' },
    { name: 'Form field', route: '/form-field' },
    { name: 'Icon', route: '/icon' },
    { name: 'Inline Editor', route: '/inline-editor' },
    { name: 'Input', route: '/input' },
    { name: 'Key value list', route: '/key-value-list' },
    { name: 'Link', route: '/style#link' },
    { name: 'Loading distractor', route: '/loading-distractor' },
    { name: 'Micro Chart', route: '/micro-chart' },
    { name: 'Overlay', route: '/overlay' },
    { name: 'Pagination', route: '/pagination' },
    { name: 'Progress circle', route: '/progress-circle' },
    { name: 'Progress bar', route: '/progress-bar' },
    { name: 'Radio', route: '/radio' },
    { name: 'Select', route: '/select' },
    { name: 'Show more', route: '/show-more' },
    { name: 'Styles', route: '/style' },
    { name: 'Switch', route: '/switch' },
    { name: 'Table', route: '/table' },
    { name: 'Tabs', route: '/tabs' },
    { name: 'Tag', route: '/tag' },
    { name: 'Tile', route: '/tile' },
    { name: 'Toast', route: '/toast' },
  ];
  selectedTheme = 'turquoise';
  themes = [
    { value: 'turquoise', name: 'Turquoise' },
    { value: 'blue', name: 'Blue' },
    { value: 'purple', name: 'Purple' },
    { value: 'royalblue', name: 'Royalblue' },
  ];

  currentDocument: DocumentContents;
  currentPath: string;
  isFetching = false;

  // tslint:disable-next-line:no-any
  private _isFetchingTimeout: any;

  constructor(
    private _locationService: LocationService,
    private _documentService: DocumentService
  ) {
    this._documentService.currentDocument.subscribe((doc) => this.currentDocument = doc);
    this._locationService.currentPath.subscribe((path) => {
      this.currentPath = path;
      // Start progress bar if doc not rendered within brief time
      clearTimeout(this._isFetchingTimeout);
      // tslint:disable-next-line:no-magic-numbers
      this._isFetchingTimeout = setTimeout(() => this.isFetching = true, 200);
    });

  }

  @HostListener('click', ['$event.target', '$event.button', '$event.ctrlKey', '$event.metaKey'])
  onClick(eventTarget: HTMLElement, button: number, ctrlKey: boolean, metaKey: boolean): boolean {
    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement | null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }
    if (target instanceof HTMLAnchorElement) {
      return this._locationService.handleAnchorClick(target, button, ctrlKey, metaKey);
    }
    // Allow the click to pass through
    return true;
  }
}
