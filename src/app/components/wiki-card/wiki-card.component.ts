import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WikipediaSearchResult } from '../../services/wiki.service';

/**
 * Component to display a single Wikipedia article as a card
 * Used by WikiList component to build a grid of retrieved articles
 */
@Component({
  selector: 'app-wiki-card',
  imports: [CommonModule],
  templateUrl: './wiki-card.component.html',
  styleUrl: './wiki-card.component.css',
})
export class WikiCardComponent {
  /**
   * Wikipedia article data to display in the card
   */
  @Input({ required: true }) article!: WikipediaSearchResult;

  /**
   * Generate Wikipedia article URL from page ID
   * @param pageid - The Wikipedia page ID
   * @returns Full URL to the Wikipedia article
   */
  getArticleUrl(pageid: number): string {
    return `https://en.wikipedia.org/?curid=${pageid}`;
  }

  /**
   * Format timestamp to readable date
   * @param timestamp - ISO timestamp string
   * @returns Formatted date string
   */
  formatDate(timestamp: string): string {
    try {
      const date = new Date(timestamp);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown date';
    }
  }

  /**
   * Clean and truncate snippet text for display
   * @param snippet - Raw snippet with HTML tags
   * @param maxLength - Maximum length of the snippet (default: 150)
   * @returns Clean, truncated snippet
   */
  cleanSnippet(snippet: string, maxLength: number = 150): string {
    // Remove HTML tags and decode HTML entities
    const cleanText = snippet
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    if (cleanText.length <= maxLength) {
      return cleanText;
    }

    // Truncate at word boundary
    const truncated = cleanText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  /**
   * Format word count for display
   * @param wordcount - Number of words in the article
   * @returns Formatted string
   */
  formatWordCount(wordcount: number): string {
    if (wordcount >= 1000) {
      return `${(wordcount / 1000).toFixed(1)}k words`;
    }
    return `${wordcount} words`;
  }

  /**
   * Format article size for display
   * @param size - Size in bytes
   * @returns Formatted string
   */
  formatSize(size: number): string {
    if (size >= 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }
    return `${size} bytes`;
  }
}
