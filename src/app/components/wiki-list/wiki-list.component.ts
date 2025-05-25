import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';
import { WikiService, WikipediaSearchResult } from '../../services/wiki.service';
import { WikiCardComponent } from '../wiki-card/wiki-card.component';

/**
 * Component that displays a list of Wikipedia articles as cards
 * Includes search functionality to fetch articles from Wikipedia API
 */
@Component({
  selector: 'app-wiki-list',
  imports: [CommonModule, FormsModule, WikiCardComponent],
  templateUrl: './wiki-list.component.html',
  styleUrl: './wiki-list.component.css'
})
export class WikiListComponent implements OnDestroy {
  /**
   * Current search term entered by the user
   */
  searchTerm: string = '';

  /**
   * Array of Wikipedia articles to display
   */
  articles: WikipediaSearchResult[] = [];

  /**
   * Loading state indicator
   */
  isLoading: boolean = false;

  /**
   * Error message to display if search fails
   */
  errorMessage: string = '';

  /**
   * Flag to indicate if a search has been performed
   */
  hasSearched: boolean = false;

  /**
   * Subject for managing component cleanup
   */
  private destroy$ = new Subject<void>();

  constructor(private wikiService: WikiService) {}

  /**
   * Performs search for Wikipedia articles using the current search term
   */
  searchArticles(): void {
    if (!this.searchTerm.trim()) {
      this.errorMessage = 'Please enter a search term';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.hasSearched = true;

    this.wikiService.searchArticles(this.searchTerm.trim(), 10)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (results: WikipediaSearchResult[]) => {
          this.articles = results;
          if (results.length === 0) {
            this.errorMessage = `No articles found for "${this.searchTerm}"`;
          }
        },
        error: (error) => {
          console.error('Error searching articles:', error);
          this.errorMessage = 'Failed to search articles. Please try again.';
          this.articles = [];
        }
      });
  }

  /**
   * Handles Enter key press in search input
   * @param event - Keyboard event
   */
  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchArticles();
    }
  }

  /**
   * Clears the current search and results
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.articles = [];
    this.errorMessage = '';
    this.hasSearched = false;
  }

  /**
   * Tracks articles by their page ID for efficient rendering
   * @param index - Array index
   * @param article - Wikipedia article
   * @returns Unique identifier for the article
   */
  trackByPageId(index: number, article: WikipediaSearchResult): number {
    return article.pageid;
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
