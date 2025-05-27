import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { WikiCardComponent } from './wiki-card.component';
import { WikiService } from '../../services/wiki.service';

describe('WikiCardComponent', () => {
  let component: WikiCardComponent;
  let fixture: ComponentFixture<WikiCardComponent>;
  let wikiService: WikiService;

  const mockArticle = {
    title: 'Angular (web framework)',
    snippet:
      'Angular is a <span class="searchmatch">TypeScript</span>-based web application framework led by the Angular Team at Google',
    pageid: 12345,
    size: 45000,
    wordcount: 3500,
    timestamp: '2023-12-15T10:30:00Z',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WikiCardComponent,
      ],      providers: [
        WikiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();    fixture = TestBed.createComponent(WikiCardComponent);
    component = fixture.componentInstance;
    wikiService = TestBed.inject(WikiService);

    // Set up mock article data
    component.article = mockArticle;

    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should require article input', () => {
      expect(component.article).toBeDefined();
      expect(component.article).toEqual(mockArticle);
    });
  });

  describe('Template Rendering', () => {
    it('should render article title', () => {
      const titleElement = fixture.debugElement.query(
        By.css('.article-title .title-link')
      );
      expect(titleElement.nativeElement.textContent.trim()).toBe(
        mockArticle.title
      );
    });

    it('should render article snippet', () => {
      const snippetElement = fixture.debugElement.query(
        By.css('.article-snippet')
      );
      expect(snippetElement.nativeElement.innerHTML).toContain('Angular is a');
      expect(snippetElement.nativeElement.innerHTML).toContain('TypeScript');
    });

    it('should render formatted date', () => {
      const dateElement = fixture.debugElement.query(By.css('.last-updated'));
      expect(dateElement.nativeElement.textContent).toContain('Dec 15, 2023');
    });

    it('should render article statistics', () => {
      const statsElements = fixture.debugElement.queryAll(By.css('.stat-item'));
      expect(statsElements.length).toBe(3);

      // Check size formatting
      const sizeText = statsElements.find((el) =>
        el.nativeElement.textContent.includes('KB')
      );
      expect(sizeText).toBeTruthy();
      expect(sizeText?.nativeElement.textContent).toContain('43.9 KB');

      // Check word count formatting
      const wordText = statsElements.find((el) =>
        el.nativeElement.textContent.includes('words')
      );
      expect(wordText).toBeTruthy();
      expect(wordText?.nativeElement.textContent).toContain('3.5k words');

      // Check page ID
      const pageIdText = statsElements.find((el) =>
        el.nativeElement.textContent.includes('#')
      );
      expect(pageIdText).toBeTruthy();
      expect(pageIdText?.nativeElement.textContent).toContain('#12345');
    });

    it('should render Wikipedia links with correct URL', () => {
      const links = fixture.debugElement.queryAll(By.css('a[target="_blank"]'));
      expect(links.length).toBe(2); // Title link and Read More button

      links.forEach((link) => {
        expect(link.nativeElement.href).toBe(
          'https://en.wikipedia.org/?curid=12345'
        );
        expect(link.nativeElement.getAttribute('rel')).toBe(
          'noopener noreferrer'
        );
      });
    });

    it('should have proper accessibility attributes', () => {
      const cardElement = fixture.debugElement.query(By.css('.wiki-card'));
      expect(cardElement.nativeElement.getAttribute('aria-label')).toBe(
        'Wikipedia article: Angular (web framework)'
      );

      const titleLink = fixture.debugElement.query(By.css('.title-link'));
      expect(titleLink.nativeElement.getAttribute('aria-label')).toBe(
        'Read Angular (web framework) on Wikipedia'
      );

      const readMoreBtn = fixture.debugElement.query(By.css('.read-more-btn'));
      expect(readMoreBtn.nativeElement.getAttribute('aria-label')).toBe(
        'Read full article: Angular (web framework)'
      );
    });
  });

  describe('Helper Methods', () => {
    it('should generate correct article URL', () => {
      const url = component.getArticleUrl(12345);
      expect(url).toBe('https://en.wikipedia.org/?curid=12345');
    });

    it('should format date correctly', () => {
      const formattedDate = component.formatDate('2023-12-15T10:30:00Z');
      expect(formattedDate).toBe('Dec 15, 2023');
    });

    it('should handle invalid date gracefully', () => {
      const formattedDate = component.formatDate('invalid-date');
      expect(formattedDate).toBe('Unknown date');
    });

    it('should clean HTML from snippet', () => {
      const dirtySnippet =
        'Angular is a <span class="searchmatch">TypeScript</span>-based framework with &quot;quotes&quot; and &amp; symbols';
      const cleanedSnippet = component.cleanSnippet(dirtySnippet);

      expect(cleanedSnippet).not.toContain('<span');
      expect(cleanedSnippet).not.toContain('</span>');
      expect(cleanedSnippet).toContain('TypeScript');
      expect(cleanedSnippet).toContain('"quotes"');
      expect(cleanedSnippet).toContain('& symbols');
    });

    it('should truncate long snippets', () => {
      const longSnippet = 'A'.repeat(200);
      const truncatedSnippet = component.cleanSnippet(longSnippet, 100);

      expect(truncatedSnippet.length).toBeLessThanOrEqual(104); // 100 + '...'
      expect(truncatedSnippet).toContain('...');
    });

    it('should truncate at word boundary', () => {
      const snippet =
        'This is a very long sentence that should be truncated at a word boundary';
      const truncated = component.cleanSnippet(snippet, 30);

      expect(truncated).toContain('...');
      expect(truncated).not.toContain('bounda...'); // Should not break mid-word
    });

    it('should not truncate short snippets', () => {
      const shortSnippet = 'Short text';
      const result = component.cleanSnippet(shortSnippet, 100);

      expect(result).toBe(shortSnippet);
      expect(result).not.toContain('...');
    });

    it('should format word count correctly', () => {
      expect(component.formatWordCount(500)).toBe('500 words');
      expect(component.formatWordCount(1500)).toBe('1.5k words');
      expect(component.formatWordCount(10000)).toBe('10.0k words');
    });

    it('should format size correctly', () => {
      expect(component.formatSize(500)).toBe('500 bytes');
      expect(component.formatSize(1536)).toBe('1.5 KB');
      expect(component.formatSize(2048)).toBe('2.0 KB');
    });
  });

  describe('Component State Changes', () => {
    it('should update display when article input changes', () => {
      const newArticle = {
        title: 'TypeScript',
        snippet: 'TypeScript is a programming language',
        pageid: 67890,
        size: 25000,
        wordcount: 2000,
        timestamp: '2023-11-20T15:45:00Z',
      };

      component.article = newArticle;
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(
        By.css('.article-title .title-link')
      );
      expect(titleElement.nativeElement.textContent.trim()).toBe('TypeScript');

      const links = fixture.debugElement.queryAll(By.css('a[target="_blank"]'));
      links.forEach((link) => {
        expect(link.nativeElement.href).toBe(
          'https://en.wikipedia.org/?curid=67890'
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle article with minimal data', () => {
      const minimalArticle = {
        title: 'Test',
        snippet: '',
        pageid: 1,
        size: 0,
        wordcount: 0,
        timestamp: '2023-01-01T00:00:00Z',
      };

      component.article = minimalArticle;
      fixture.detectChanges();

      expect(component.formatSize(0)).toBe('0 bytes');
      expect(component.formatWordCount(0)).toBe('0 words');
      expect(component.cleanSnippet('')).toBe('');
    });

    it('should handle very large numbers', () => {
      expect(component.formatWordCount(999999)).toBe('1000.0k words');
      expect(component.formatSize(999999)).toBe('976.6 KB');
    });

    it('should handle special characters in title', () => {
      const specialArticle = {
        title: 'C++ & "Programming" <Language>',
        snippet: 'A programming language',
        pageid: 999,
        size: 1000,
        wordcount: 100,
        timestamp: '2023-01-01T00:00:00Z',
      };

      component.article = specialArticle;
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(
        By.css('.article-title .title-link')
      );
      expect(titleElement.nativeElement.textContent).toContain('C++');
      expect(titleElement.nativeElement.textContent).toContain('Programming');
    });
  });

  describe('User Interactions', () => {
    it('should have clickable title link', () => {
      const titleLink = fixture.debugElement.query(By.css('.title-link'));
      expect(titleLink.nativeElement.tagName).toBe('A');
      expect(titleLink.nativeElement.href).toBe(
        'https://en.wikipedia.org/?curid=12345'
      );
    });

    it('should have clickable read more button', () => {
      const readMoreBtn = fixture.debugElement.query(By.css('.read-more-btn'));
      expect(readMoreBtn.nativeElement.tagName).toBe('A');
      expect(readMoreBtn.nativeElement.href).toBe(
        'https://en.wikipedia.org/?curid=12345'
      );
      expect(readMoreBtn.nativeElement.textContent.trim()).toContain(
        'Read More'
      );
    });
  });
});
