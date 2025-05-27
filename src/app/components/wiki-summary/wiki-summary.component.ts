import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, switchMap, finalize } from 'rxjs';
import { WikiService, WikipediaSearchResult, WikipediaSummary } from '../../services/wiki.service';

/**
 * Component that displays the detailed summary of a Wikipedia article
 * Subscribes to the selected article from WikiService and fetches its summary
 */
@Component({
  selector: 'app-wiki-summary',
  imports: [CommonModule],
  templateUrl: './wiki-summary.component.html',
  styleUrl: './wiki-summary.component.css',
})
export class WikiSummaryComponent implements OnInit, OnDestroy {
  /**
   * Currently selected article
   */
  selectedArticle: WikipediaSearchResult | null = null;

  /**
   * Article summary data from Wikipedia REST API
   */
  summary: WikipediaSummary | null = null;

  /**
   * Loading state indicator
   */
  isLoading: boolean = false;

  /**
   * Error message to display if summary fetch fails
   */
  errorMessage: string = '';

  /**
   * Subject for managing component cleanup
   */
  private destroy$ = new Subject<void>();

  constructor(
    private wikiService: WikiService,
    private router: Router
  ) {}

  /**
   * Component initialization
   * Subscribe to selected article and fetch summary when available
   */
  ngOnInit(): void {
    this.wikiService.selectedArticle$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article: WikipediaSearchResult | null) => {
          this.selectedArticle = article;
          this.errorMessage = '';
          
          if (article) {
            this.fetchSummary(article.title);
          } 
          else {
            // No article selected, redirect to search page
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error('Error getting selected article:', error);
          this.errorMessage = 'Error loading article data';
        }
      });
  }
  /**
   * Fetch article summary from Wikipedia API
   * @param title - The article title to fetch summary for
   */
  fetchSummary(title: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.wikiService.getArticleSummary(title)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (summaryData: WikipediaSummary) => {
          this.summary = summaryData;
        },
        error: (error) => {
          console.error('Error fetching article summary:', error);
          this.errorMessage = 'Failed to load article summary. Please try again.';
          this.summary = null;
        }
      });
  }

  /**
   * Navigate back to the search page
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Open the full Wikipedia article in a new tab
   * @param pageid - The Wikipedia page ID
   */
  openFullArticle(pageid: number): void {
    const url = `https://en.wikipedia.org/?curid=${pageid}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Format timestamp to readable date
   * @param timestamp - ISO timestamp string
   * @returns Formatted date string
   */
  formatDate(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  }

  /**
   * Format file size for display
   * @param size - Size in bytes
   * @returns Formatted string
   */
  formatSize(size: number): string {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else if (size >= 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${size} bytes`;
  }

  /**
   * Format word count for display
   * @param wordcount - Number of words
   * @returns Formatted string
   */
  formatWordCount(wordcount: number): string {
    if (wordcount >= 1000) {
      return `${(wordcount / 1000).toFixed(1)}k words`;
    }
    return `${wordcount} words`;
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
