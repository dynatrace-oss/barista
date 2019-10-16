// tslint:disable: indent object-literal-key-quotes quotemark trailing-comma max-line-length no-duplicate-imports max-file-line-count

import { Component, OnInit } from '@angular/core';
import { BaLocationService } from 'shared/location.service';
import { BaSinglePageContents } from 'shared/page-contents';
import { BaPageService } from 'shared/page.service';

@Component({
  selector: 'ba-app',
  templateUrl: 'app.html',
  host: {
    '(click)':
      '_handleClick($event.target, $event.button, $event.ctrlKey, $event.metaKey)',
  },
})
export class BaApp implements OnInit {
  /**
   * @internal
   * The object containing all data needed to display the current page.
   */
  _currentPage: BaSinglePageContents;

  constructor(
    private pageService: BaPageService,
    private locationService: BaLocationService,
  ) {}

  ngOnInit(): void {
    this.pageService.currentPage.subscribe(page => (this._currentPage = page));
  }

  /**
   * @interal
   * Handles all anchor clicks in app.
   */
  _handleClick(
    eventTarget: HTMLElement,
    button: number,
    ctrlKey: boolean,
    metaKey: boolean,
  ): boolean {
    // Deal with anchor clicks; climb DOM tree until anchor found (or null)
    let target: HTMLElement | null = eventTarget;
    while (target && !(target instanceof HTMLAnchorElement)) {
      target = target.parentElement;
    }

    if (target instanceof HTMLAnchorElement) {
      return this.locationService.handleAnchorClick(
        target,
        button,
        ctrlKey,
        metaKey,
      );
    }

    // Allow the click to pass through
    return true;
  }
}
