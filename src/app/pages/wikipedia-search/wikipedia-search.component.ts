import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ResultsListComponent } from '../../components/results-list/results-list.component';
import { WikipediaService } from '../../services/wikipedia.service';
import { SearchState, WikipediaSearchResult } from '../../models/wikipedia.model';

/**
 * Main page component for Wikipedia search functionality
 */
@Component({
  selector: 'app-wikipedia-search',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    SearchBarComponent,
    ResultsListComponent
  ],
  templateUrl: './wikipedia-search.component.html',
  styleUrl: './wikipedia-search.component.css'
})
export class WikipediaSearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  
  searchState: SearchState = {
    isLoading: false,
    results: [],
    error: null,
    hasSearched: false
  };

  constructor(private wikipediaService: WikipediaService) {}

  /**
   * Handle search term input from search bar component
   * @param searchTerm The search term entered by user
   */
  onSearchTermChanged(searchTerm: string): void {
    this.searchArticles(searchTerm);
  }

  /**
   * Search for Wikipedia articles
   * @param searchTerm The term to search for
   */
  private searchArticles(searchTerm: string): void {
    this.searchState = {
      isLoading: true,
      results: [],
      error: null,
      hasSearched: true
    };

    this.wikipediaService
      .searchArticles(searchTerm, 15)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results: WikipediaSearchResult[]) => {
          this.searchState = {
            isLoading: false,
            results,
            error: null,
            hasSearched: true
          };
        },
        error: (error: Error) => {
          this.searchState = {
            isLoading: false,
            results: [],
            error: error.message,
            hasSearched: true
          };
        }
      });
  }

  /**
   * Clean up subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
