import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocationService {

  private readonly _urlParser = document.createElement('a');
  private _urlSubject = new ReplaySubject<string>(1);

  currentUrl = this._urlSubject.pipe(map((url) => this._stripSlashes(this._cleanUrl(url))));
  currentPath = this.currentUrl.pipe(map((url) => (url.match(/[^?#]*/) || [])[0]));

  constructor(private _location: Location) {
    this._urlSubject.next(_location.path(true));
    this._location.subscribe((state) => { this._urlSubject.next(this._cleanUrl(state.url as string) || ''); });
  }

  go(url: string | null | undefined): void {
    if (!url) { return; }
    // tslint:disable-next-line:no-parameter-reassignment
    url = this._stripSlashes(url);
    if (/^http/.test(url)) {
      this.goExternal(url);
    } else {
      this._location.go(url);
      this._urlSubject.next(url);
    }
  }

  goExternal(url: string): void {
    window.location.assign(url);
  }

  replace(url: string): void {
    window.location.replace(url);
  }

  handleAnchorClick(
    anchor: HTMLAnchorElement,
    button: number = 0,
    ctrlKey: boolean = false,
    metaKey: boolean = false
  ): boolean {
    // Check for modifier keys and non-left-button, which indicate the user wants to control navigation
    if (button !== 0 || ctrlKey || metaKey) {
      return true;
    }

    // If there is a target and it is not `_self` then we take this
    // as a signal that it doesn't want to be intercepted.
    // TODO: should we also allow an explicit `_self` target to opt-out?
    const anchorTarget = anchor.target;
    if (anchorTarget && anchorTarget !== '_self') {
      return true;
    }

    if (anchor.getAttribute('download') !== null) {
      return true; // let the download happen
    }

    const { pathname, search, hash } = anchor;
    const relativeUrl = pathname + search + hash;
    this._urlParser.href = relativeUrl;

    // don't navigate if external link or has extension
    if (anchor.href !== this._urlParser.href || !/\/[^/.]*$/.test(pathname)) {
      return true;
    }

    this.go(relativeUrl);
    return false;
  }

  private _cleanUrl(url: string): string {
    const path = environment.deployUrl.replace(window.location.origin, '');
    const result = url.replace(path, '');
    console.log('cleanUrl', result);
    return result;
  }

  private _stripSlashes(url: string): string {
    return url.replace(/^\/+/, '').replace(/\/+(\?|#|$)/, '$1');
  }
}
