import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { NYTResponse } from "./nyt.interface";

export interface Config {
  api_key: string;
}
export const CONFIG_TOKEN = new InjectionToken<Config>('nyt.config');

/**
 * A service wrapping New York Times public Books API
 */
@Injectable()
export class NYTBooksService {
  private _apiKey: string;

  constructor(@Inject(CONFIG_TOKEN) private config: Config, private _http: HttpClient) {
    this._apiKey = this.config.api_key
  }
  
  private getWrapper(url: string, params: HttpParams): Observable<NYTResponse> {
    params = params.append('api-key', this._apiKey);
    return this._http.get(url, { params: params, reportProgress: true }) as Observable<NYTResponse>;
  }
  
  getListsOverview(date?: string): Observable<NYTResponse> {
    let dateValidator = new RegExp('^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$'),
      params = new HttpParams();
    if (date) {
      if (!dateValidator.test(date)) throw Error('Invalid Date Format, YYYY-DD-MM required.');
      params = params.append('published_date', date);
    }
    
    return this.getWrapper('https://api.nytimes.com/svc/books/v3/lists/overview.json', params);
  }

}
