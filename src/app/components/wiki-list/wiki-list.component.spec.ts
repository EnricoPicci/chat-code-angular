import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError, Subject } from 'rxjs';
import { WikiListComponent } from './wiki-list.component';
import { WikiService, WikipediaSearchResult } from '../../services/wiki.service';
import { WikiCardComponent } from '../wiki-card/wiki-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WikiListComponent', () => {
  let component: WikiListComponent;
  let fixture: ComponentFixture<WikiListComponent>;
  let mockWikiService: jasmine.SpyObj<WikiService>;

  const mockSearchResults: WikipediaSearchResult[] = [
    {
      title: 'Angular (web framework)',
      snippet: 'Angular is a TypeScript-based web application framework',
      pageid: 12345,
      size: 45000,
      wordcount: 3500,
      timestamp: '2023-12-15T10:30:00Z'
    },
    {
      title: 'AngularJS',
      snippet: 'AngularJS is a discontinued JavaScript-based web framework',
      pageid: 12346,
      size: 35000,
      wordcount: 2800,
      timestamp: '2023-11-20T15:45:00Z'
    }
  ];

  beforeEach(async () => {
    const wikiServiceSpy = jasmine.createSpyObj('WikiService', ['searchArticles']);

    await TestBed.configureTestingModule({
      imports: [WikiListComponent, FormsModule, WikiCardComponent],
      providers: [
        { provide: WikiService, useValue: wikiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WikiListComponent);
    component = fixture.componentInstance;
    mockWikiService = TestBed.inject(WikiService) as jasmine.SpyObj<WikiService>;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.searchTerm).toBe('');
      expect(component.articles).toEqual([]);
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('');
      expect(component.hasSearched).toBe(false);
    });

    it('should inject WikiService', () => {
      expect(mockWikiService).toBeTruthy();
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should render page title and description', () => {
      const titleElement = fixture.debugElement.query(By.css('.page-title'));
      const descriptionElement = fixture.debugElement.query(By.css('.page-description'));
      
      expect(titleElement.nativeElement.textContent).toContain('Wikipedia Article Search');
      expect(descriptionElement.nativeElement.textContent).toContain('Search and explore Wikipedia articles');
    });

    it('should render search input with correct attributes', () => {
      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      
      expect(searchInput.nativeElement.type).toBe('text');
      expect(searchInput.nativeElement.placeholder).toContain('Enter search term');
      expect(searchInput.nativeElement.maxLength).toBe(100);
      expect(searchInput.nativeElement.autocomplete).toBe('off');
    });

    it('should render search button', () => {
      const searchButton = fixture.debugElement.query(By.css('.search-btn'));
      
      expect(searchButton.nativeElement.textContent).toContain('Search');
      expect(searchButton.nativeElement.type).toBe('button');
    });

    it('should render welcome section when no search has been performed', () => {
      const welcomeSection = fixture.debugElement.query(By.css('.welcome-section'));
      const welcomeTitle = fixture.debugElement.query(By.css('.welcome-title'));
      
      expect(welcomeSection).toBeTruthy();
      expect(welcomeTitle.nativeElement.textContent).toContain('Welcome to Wikipedia Search');
    });

    it('should render example search tags', () => {
      const exampleTags = fixture.debugElement.queryAll(By.css('.example-tag'));
      
      expect(exampleTags.length).toBe(5);
      expect(exampleTags[0].nativeElement.textContent.trim()).toBe('Angular');
      expect(exampleTags[1].nativeElement.textContent.trim()).toBe('TypeScript');
    });

    it('should disable search button when search term is empty', () => {
      const searchButton = fixture.debugElement.query(By.css('.search-btn'));
      
      expect(searchButton.nativeElement.disabled).toBe(true);
    });

    it('should enable search button when search term is provided', () => {
      component.searchTerm = 'Angular';
      fixture.detectChanges();
      
      const searchButton = fixture.debugElement.query(By.css('.search-btn'));
      expect(searchButton.nativeElement.disabled).toBe(false);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call WikiService.searchArticles when searchArticles is called', fakeAsync(() => {
      component.searchTerm = 'Angular';
      mockWikiService.searchArticles.and.returnValue(of(mockSearchResults));

      component.searchArticles();
      tick();

      expect(mockWikiService.searchArticles).toHaveBeenCalledWith('Angular', 10);
      expect(component.articles).toEqual(mockSearchResults);
      expect(component.hasSearched).toBe(true);
    }));

    it('should show error message for empty search term', () => {
      component.searchTerm = '';
      component.searchArticles();

      expect(component.errorMessage).toBe('Please enter a search term');
      expect(mockWikiService.searchArticles).not.toHaveBeenCalled();
    });

    it('should show error message for whitespace-only search term', () => {
      component.searchTerm = '   ';
      component.searchArticles();

      expect(component.errorMessage).toBe('Please enter a search term');
      expect(mockWikiService.searchArticles).not.toHaveBeenCalled();
    });

    it('should set loading state during search', fakeAsync(() => {
      component.searchTerm = 'Angular';
      const searchSubject = new Subject<WikipediaSearchResult[]>();
      mockWikiService.searchArticles.and.returnValue(searchSubject);

      component.searchArticles();

      expect(component.isLoading).toBe(true);
      expect(component.errorMessage).toBe('');

      searchSubject.next(mockSearchResults);
      searchSubject.complete();
      tick();

      expect(component.isLoading).toBe(false);
    }));

    it('should handle search errors gracefully', fakeAsync(() => {
      component.searchTerm = 'Angular';
      mockWikiService.searchArticles.and.returnValue(throwError(() => new Error('API Error')));

      component.searchArticles();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Failed to search articles. Please try again.');
      expect(component.articles).toEqual([]);
    }));

    it('should show message when no results found', fakeAsync(() => {
      component.searchTerm = 'NonExistentTerm';
      mockWikiService.searchArticles.and.returnValue(of([]));

      component.searchArticles();
      tick();

      expect(component.articles).toEqual([]);
      expect(component.errorMessage).toBe('No articles found for "NonExistentTerm"');
    }));

    it('should trigger search when Enter key is pressed', () => {
      component.searchTerm = 'Angular';
      mockWikiService.searchArticles.and.returnValue(of(mockSearchResults));
      spyOn(component, 'searchArticles');

      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' });
      
      searchInput.nativeElement.dispatchEvent(enterEvent);

      expect(component.searchArticles).toHaveBeenCalled();
    });

    it('should not trigger search for other keys', () => {
      spyOn(component, 'searchArticles');

      const searchInput = fixture.debugElement.query(By.css('.search-input'));
      const tabEvent = new KeyboardEvent('keypress', { key: 'Tab' });
      
      searchInput.nativeElement.dispatchEvent(tabEvent);

      expect(component.searchArticles).not.toHaveBeenCalled();
    });
  });

  describe('Clear Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should clear search state', () => {
      component.searchTerm = 'Angular';
      component.articles = mockSearchResults;
      component.errorMessage = 'Some error';
      component.hasSearched = true;

      component.clearSearch();

      expect(component.searchTerm).toBe('');
      expect(component.articles).toEqual([]);
      expect(component.errorMessage).toBe('');
      expect(component.hasSearched).toBe(false);
    });

    it('should show clear button only after search has been performed', fakeAsync(() => {
      // Initially no clear button
      let clearButton = fixture.debugElement.query(By.css('.clear-btn'));
      expect(clearButton).toBeFalsy();

      // Perform search
      component.searchTerm = 'Angular';
      mockWikiService.searchArticles.and.returnValue(of(mockSearchResults));
      component.searchArticles();
      tick();
      fixture.detectChanges();

      // Clear button should appear
      clearButton = fixture.debugElement.query(By.css('.clear-btn'));
      expect(clearButton).toBeTruthy();
    }));
  });

  describe('Results Display', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display articles using WikiCard component', fakeAsync(() => {
      component.searchTerm = 'Angular';
      component.articles = mockSearchResults;
      component.hasSearched = true;
      mockWikiService.searchArticles.and.returnValue(of(mockSearchResults));

      fixture.detectChanges();

      const wikiCards = fixture.debugElement.queryAll(By.css('app-wiki-card'));
      expect(wikiCards.length).toBe(2);
      
      // Check that correct articles are passed to cards
      expect(wikiCards[0].componentInstance.article).toEqual(mockSearchResults[0]);
      expect(wikiCards[1].componentInstance.article).toEqual(mockSearchResults[1]);
    }));

    it('should display results header with count', fakeAsync(() => {
      component.searchTerm = 'Angular';
      component.articles = mockSearchResults;
      component.hasSearched = true;
      fixture.detectChanges();

      const resultsTitle = fixture.debugElement.query(By.css('.results-title'));
      expect(resultsTitle.nativeElement.textContent).toContain('Found 2 articles for "Angular"');
    }));

    it('should handle singular article count correctly', fakeAsync(() => {
      component.searchTerm = 'Angular';
      component.articles = [mockSearchResults[0]];
      component.hasSearched = true;
      fixture.detectChanges();

      const resultsTitle = fixture.debugElement.query(By.css('.results-title'));
      expect(resultsTitle.nativeElement.textContent).toContain('Found 1 article for "Angular"');
    }));

    it('should show loading spinner during search', fakeAsync(() => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingSection = fixture.debugElement.query(By.css('.loading-section'));
      const loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner'));
      const loadingText = fixture.debugElement.query(By.css('.loading-text'));

      expect(loadingSection).toBeTruthy();
      expect(loadingSpinner).toBeTruthy();
      expect(loadingText.nativeElement.textContent).toContain('Searching Wikipedia articles...');
    }));

    it('should show error message when error occurs', () => {
      component.errorMessage = 'Test error message';
      component.isLoading = false;
      fixture.detectChanges();

      const errorSection = fixture.debugElement.query(By.css('.error-section'));
      const errorMessage = fixture.debugElement.query(By.css('.error-message'));

      expect(errorSection).toBeTruthy();
      expect(errorMessage.nativeElement.textContent).toBe('Test error message');
    });

    it('should show no results message when no articles found', () => {
      component.searchTerm = 'NonExistent';
      component.articles = [];
      component.hasSearched = true;
      component.errorMessage = '';
      fixture.detectChanges();

      const noResults = fixture.debugElement.query(By.css('.no-results'));
      const noResultsTitle = fixture.debugElement.query(By.css('.no-results-title'));

      expect(noResults).toBeTruthy();
      expect(noResultsTitle.nativeElement.textContent).toBe('No articles found');
    });
  });

  describe('Example Tags Functionality', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should trigger search when example tag is clicked', fakeAsync(() => {
      mockWikiService.searchArticles.and.returnValue(of(mockSearchResults));
      spyOn(component, 'searchArticles').and.callThrough();

      const exampleTags = fixture.debugElement.queryAll(By.css('.example-tag'));
      exampleTags[0].nativeElement.click();

      expect(component.searchTerm).toBe('Angular');
      expect(component.searchArticles).toHaveBeenCalled();
    }));
  });

  describe('TrackBy Function', () => {
    it('should return pageid for trackBy function', () => {
      const article = mockSearchResults[0];
      const result = component.trackByPageId(0, article);
      
      expect(result).toBe(article.pageid);
    });
  });

  describe('Component Lifecycle', () => {
    it('should complete destroy subject on ngOnDestroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });

    it('should unsubscribe from observables on destroy', fakeAsync(() => {
      component.searchTerm = 'Angular';
      const searchSubject = new Subject<WikipediaSearchResult[]>();
      mockWikiService.searchArticles.and.returnValue(searchSubject);

      component.searchArticles();
      expect(component.isLoading).toBe(true);

      // Destroy component before observable completes
      component.ngOnDestroy();
      searchSubject.next(mockSearchResults);
      tick();

      // Should not update component state after destruction
      expect(component.articles).toEqual([]);
    }));
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have proper ARIA labels', () => {
      const searchInput = fixture.debugElement.query(By.css('#search-input'));
      const searchLabel = fixture.debugElement.query(By.css('label[for="search-input"]'));
      
      expect(searchLabel).toBeTruthy();
      expect(searchLabel.nativeElement.className).toContain('sr-only');
    });

    it('should have proper role attributes', fakeAsync(() => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingSection = fixture.debugElement.query(By.css('.loading-section'));
      expect(loadingSection.nativeElement.getAttribute('role')).toBe('status');
      expect(loadingSection.nativeElement.getAttribute('aria-live')).toBe('polite');
    }));

    it('should have error alerts with proper ARIA attributes', () => {
      component.errorMessage = 'Test error';
      component.isLoading = false;
      fixture.detectChanges();

      const errorSection = fixture.debugElement.query(By.css('.error-section'));
      expect(errorSection.nativeElement.getAttribute('role')).toBe('alert');
      expect(errorSection.nativeElement.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('Button States', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should disable buttons during loading', fakeAsync(() => {
      component.searchTerm = 'Angular';
      component.isLoading = true;
      component.hasSearched = true;
      fixture.detectChanges();

      const searchButton = fixture.debugElement.query(By.css('.search-btn'));
      const clearButton = fixture.debugElement.query(By.css('.clear-btn'));

      expect(searchButton.nativeElement.disabled).toBe(true);
      expect(clearButton.nativeElement.disabled).toBe(true);
    }));

    it('should show loading text on search button during loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const searchButton = fixture.debugElement.query(By.css('.search-btn .btn-text'));
      expect(searchButton.nativeElement.textContent.trim()).toBe('Searching...');
    });
  });
});
