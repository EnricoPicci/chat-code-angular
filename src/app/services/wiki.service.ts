import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WikipediaSearchResult } from '../interfaces/wikipedia-search-result';

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private readonly WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

  constructor(private http: HttpClient) { }

  getArticleSummary(searchTerm: string): Observable<WikipediaSearchResult> {
    return this.http.get<WikipediaSearchResult>(`${this.WIKIPEDIA_API_URL}${encodeURIComponent(searchTerm)}`);
  }
}
