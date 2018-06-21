import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AsyncSubject, Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { LocationService } from './location.service';
import { Converter, setFlavor, ShowdownExtension } from 'showdown';

export const DOC_CONTENT_URL_PREFIX = 'assets/doc/';

const FILE_NOT_FOUND_ERROR_CONTENTS = `
  <h1>File not found Error 404</h1>
`;

const FETCHING_ERROR_CONTENTS = `
  <h1>An error occured</h1>
`;

export interface DocumentContents {
  id: string;
  content: string;
}

const SHOWDOWN_OPTIONS = {
  tables: true,
  simpleLineBreaks: true,
  smartIndentationFix: true,
  // noHeaderId: true,
};

const SHOWDOWN_CLASS_MAP = {
  table: 'table',
};

@Injectable({ providedIn: 'root' })
export class DocumentService {

  private _markdown = new Converter(SHOWDOWN_OPTIONS);
  private _cache = new Map<string, Observable<DocumentContents>>();

  currentDocument: Observable<DocumentContents>;

  constructor(private _http: HttpClient, location: LocationService) {
    this.currentDocument = location.currentPath.pipe(switchMap((path) => this.getDocument(path)));

    const bindings = Object.keys(SHOWDOWN_CLASS_MAP)
      .map((key) => ({
        type: 'output',
        regex: new RegExp(`<${key}>`, 'g'),
        replace: `<${key} class="${SHOWDOWN_CLASS_MAP[key]}">`,
      }));

    this._markdown.addExtension(bindings, 'custom-markdown-classes');
    setFlavor('github');
  }

  private getDocument(url: string): Observable<DocumentContents> {
    const id = url || 'index';

    if (!this._cache.has(id)) {
      this._cache.set(id, this.fetchDocument(id));
    }
    return this._cache.get(id)!;
  }

  private fetchDocument(id: string): Observable<DocumentContents> {
    const requestPath = `${DOC_CONTENT_URL_PREFIX}${id}/README.md`;
    const subject = new AsyncSubject<DocumentContents>();

    this._http.get(requestPath, { responseType: 'text' })
      .pipe(
        map((response) => {
          const document: DocumentContents = {
            content: this.generateHTML(response),
            id,
          };
          return document;
        }),
        catchError((error: HttpErrorResponse) => this.getError(id, error)))
      .subscribe(subject);

    return subject.asObservable();
  }

  private generateHTML(content: string): string {
    const regex = /({{component-demo name)=\"(.+?)\"(}})/g;

    const _tmp = content.replace(regex, (match: string, p1: string, p2: string, p3: string): string => {
      let replaced = match.replace(p1, '<docs-source-example example');
      replaced = replaced.replace(p3, '></docs-source-example>');
      return replaced;
    });
    return this._markdown.makeHtml(_tmp);
  }

  private getError(id: string, error: HttpErrorResponse): Observable<string> {
    this._cache.delete(id);
    // tslint:disable-next-line:no-magic-numbers
    return of(error.status === 404 ? FILE_NOT_FOUND_ERROR_CONTENTS : FETCHING_ERROR_CONTENTS);
  }
}
