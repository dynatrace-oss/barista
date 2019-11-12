import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private _http: HttpClient) {}

  getFixture<T>(path: string): Observable<T> {
    return this._http.get<T>(`/fixtures${path}`);
  }
}
