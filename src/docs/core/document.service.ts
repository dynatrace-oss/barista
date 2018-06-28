import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { LocationService } from './location.service';
import { Converter, setFlavor } from 'showdown';
import { environment } from '../environments/environment';

export const DOC_CONTENT_URL_PREFIX = `${environment.deployUrl.replace(/\/+$/, '')}/assets/doc/`;

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

enum SHOWDOWN_CLASS_MAP {
  table = 'table',
  a = 'dt-link',
}

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
        replace: `<${key} class="${SHOWDOWN_CLASS_MAP[key as keyof typeof SHOWDOWN_CLASS_MAP]}">`,
      }));

    this._markdown.addExtension(bindings, 'custom-markdown-classes');
    setFlavor('github');
  }

  private getDocument(url: string): Observable<DocumentContents> {
    const basePath = environment.deployUrl.replace(/^\/|\/$/g, '');
    const id = url.replace(new RegExp(`^${basePath}`), '') || 'index';
    // console.log(environment.deployUrl)
    // console.log(url)
    if (!this._cache.has(id)) {
      this._cache.set(id, this.fetchDocument(id));
    }
    return this._cache.get(id)!;
  }

  private fetchDocument(id: string): Observable<DocumentContents> {
    const requestPath = `${DOC_CONTENT_URL_PREFIX}${id}/README.md`;

    return this._http.get(requestPath, { responseType: 'text' })
      .pipe(
        map((response: string) => {
          const document: DocumentContents = {
            content: this._markdown.makeHtml(response),
            id,
          };
          return document;
        }),
        catchError((error: HttpErrorResponse) => this.getError(id, error))
      );
  }

  private getError(id: string, error: HttpErrorResponse): Observable<DocumentContents> {
    this._cache.delete(id);
    // tslint:disable-next-line:no-magic-numbers
    const errorMessage = error.status === 404 ? FILE_NOT_FOUND_ERROR_CONTENTS : FETCHING_ERROR_CONTENTS;
    return of ({
      id: 'error',
      content: errorMessage,
    });
  }
}
