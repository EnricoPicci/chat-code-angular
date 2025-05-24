import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WikipediaSearchResult } from '../../models/wikipedia.model';

/**
 * Component for displaying Wikipedia search results
 */
@Component({
  selector: 'app-results-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './results-list.component.html',
  styleUrl: './results-list.component.css'
})
export class ResultsListComponent {
  @Input() results: WikipediaSearchResult[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  @Input() hasSearched = false;

  /**
   * Open Wikipedia article in new tab
   * @param url Wikipedia article URL
   */
  openArticle(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Track by function for ngFor optimization
   * @param index Item index
   * @param item Search result item
   * @returns Unique identifier for the item
   */
  trackByUrl(index: number, item: WikipediaSearchResult): string {
    return item.url;
  }
}
