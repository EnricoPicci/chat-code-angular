import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { WikiService, WikipediaSearchResult } from './wiki.service';
import { firstValueFrom } from 'rxjs';

/**
 * Integration tests for WikiService using real Wikipedia API
 * These tests make actual HTTP requests to Wikipedia
 */
describe('WikiService Integration Tests', () => {
  let service: WikiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WikiService, provideHttpClient()],
    });
    service = TestBed.inject(WikiService);
  });

  describe('searchArticles with real API', () => {
    it('should search for Angular articles from real Wikipedia API', async () => {
      const searchTerm = 'Angular framework';

      try {
        const results = await firstValueFrom(
          service.searchArticles(searchTerm, 5)
        );

        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        expect(results.length).toBeLessThanOrEqual(5);

        // Check that results have the expected structure
        const firstResult = results[0];
        expect(firstResult.title).toBeDefined();
        expect(firstResult.snippet).toBeDefined();
        expect(firstResult.pageid).toBeDefined();
        expect(firstResult.size).toBeDefined();
        expect(firstResult.wordcount).toBeDefined();
        expect(firstResult.timestamp).toBeDefined();

        expect(typeof firstResult.title).toBe('string');
        expect(typeof firstResult.snippet).toBe('string');
        expect(typeof firstResult.pageid).toBe('number');
        expect(typeof firstResult.size).toBe('number');
        expect(typeof firstResult.wordcount).toBe('number');
        expect(typeof firstResult.timestamp).toBe('string');

        // Should contain Angular-related content
        const hasAngularContent = results.some(
          (result) =>
            result.title.toLowerCase().includes('angular') ||
            result.snippet.toLowerCase().includes('angular')
        );
        expect(hasAngularContent).toBe(true);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000); // 10 second timeout for real API calls

    it('should search for TypeScript articles from real Wikipedia API', async () => {
      const searchTerm = 'TypeScript';

      try {
        const results = await firstValueFrom(
          service.searchArticles(searchTerm, 3)
        );

        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeGreaterThan(0);
        expect(results.length).toBeLessThanOrEqual(3);

        // Should find TypeScript-related articles
        const hasTypeScriptContent = results.some(
          (result) =>
            result.title.toLowerCase().includes('typescript') ||
            result.snippet.toLowerCase().includes('typescript')
        );
        expect(hasTypeScriptContent).toBe(true);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);

    it('should handle search with no results gracefully', async () => {
      const searchTerm = 'xyzqwertynonexistentterm123456789';

      try {
        const results = await firstValueFrom(
          service.searchArticles(searchTerm)
        );

        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
        // Should return empty array for no results
        expect(results.length).toBe(0);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);
  });

  describe('getArticleSummary with real API', () => {
    it('should get Angular article summary from real Wikipedia API', async () => {
      const title = 'Angular (web framework)';

      try {
        const summary = await firstValueFrom(service.getArticleSummary(title));

        expect(summary).toBeDefined();
        expect(summary.title).toBeDefined();
        expect(summary.extract).toBeDefined();
        expect(summary.title).toContain('Angular');
        expect(typeof summary.extract).toBe('string');
        expect(summary.extract.length).toBeGreaterThan(0);

        // Should have Wikipedia-specific properties
        expect(summary.pageid).toBeDefined();
        expect(summary.lang).toBeDefined();
        expect(summary.lang).toBe('en');
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);

    it('should get JavaScript article summary from real Wikipedia API', async () => {
      const title = 'JavaScript';

      try {
        const summary = await firstValueFrom(service.getArticleSummary(title));

        expect(summary).toBeDefined();
        expect(summary.title).toBe('JavaScript');
        expect(summary.extract).toContain('JavaScript');
        expect(summary.extract.length).toBeGreaterThan(50); // Should have substantial content
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);

    it('should handle article with special characters', async () => {
      const title = 'C++';

      try {
        const summary = await firstValueFrom(service.getArticleSummary(title));

        expect(summary).toBeDefined();
        expect(summary.title).toBe('C++');
        expect(summary.extract).toContain('C++');
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);
  });

  describe('getRandomArticles with real API', () => {
    it('should get random articles from real Wikipedia API', async () => {
      try {
        const titles = await firstValueFrom(service.getRandomArticles(3));

        expect(titles).toBeDefined();
        expect(Array.isArray(titles)).toBe(true);
        expect(titles.length).toBe(3);

        // All titles should be strings
        titles.forEach((title) => {
          expect(typeof title).toBe('string');
          expect(title.length).toBeGreaterThan(0);
        });

        // All titles should be unique
        const uniqueTitles = new Set(titles);
        expect(uniqueTitles.size).toBe(titles.length);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);

    it('should get single random article when no count specified', async () => {
      try {
        const titles = await firstValueFrom(service.getRandomArticles());

        expect(titles).toBeDefined();
        expect(Array.isArray(titles)).toBe(true);
        expect(titles.length).toBe(1);
        expect(typeof titles[0]).toBe('string');
        expect(titles[0].length).toBeGreaterThan(0);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);

    it('should limit to maximum 10 articles even when requesting more', async () => {
      try {
        const titles = await firstValueFrom(service.getRandomArticles(15));

        expect(titles).toBeDefined();
        expect(Array.isArray(titles)).toBe(true);
        expect(titles.length).toBeLessThanOrEqual(10);
        expect(titles.length).toBeGreaterThan(0);
      } catch (error) {
        fail(`Real API call failed: ${error}`);
      }
    }, 10000);
  });

  describe('Error handling with real API', () => {
    it('should handle non-existent article gracefully', async () => {
      const title = 'ThisArticleDefinitelyDoesNotExistOnWikipedia123456789';

      try {
        await firstValueFrom(service.getArticleSummary(title));
        fail('Should have thrown an error for non-existent article');
      } catch (error) {
        expect((error as Error).message).toBe(
          'Failed to fetch article summary'
        );
      }
    }, 10000);

    it('should validate empty search term', async () => {
      try {
        await firstValueFrom(service.searchArticles(''));
        fail('Should have thrown an error for empty search term');
      } catch (error) {
        expect((error as Error).message).toBe('Search term cannot be empty');
      }
    });

    it('should validate empty article title', async () => {
      try {
        await firstValueFrom(service.getArticleSummary(''));
        fail('Should have thrown an error for empty title');
      } catch (error) {
        expect((error as Error).message).toBe('Article title cannot be empty');
      }
    });
  });
});

// test code generated by AI
