import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError, Subject, BehaviorSubject } from 'rxjs';
import { WikiSummaryComponent } from './wiki-summary.component';
import { WikiService, WikipediaSearchResult, WikipediaSummary } from '../../services/wiki.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('WikiSummaryComponent', () => {
  let component: WikiSummaryComponent;
  let fixture: ComponentFixture<WikiSummaryComponent>;
  let mockWikiService: jasmine.SpyObj<WikiService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let selectedArticleSubject: BehaviorSubject<WikipediaSearchResult | null>;

  const mockArticle: WikipediaSearchResult = {
    title: 'Angular (web framework)',
    snippet: 'Angular is a TypeScript-based web application framework',
    pageid: 12345,
    size: 45000,
    wordcount: 3500,
    timestamp: '2023-12-15T10:30:00Z'
  };
  const mockSummary: WikipediaSummary = {
    type: 'standard',
    title: 'Angular (web framework)',
    displaytitle: 'Angular (web framework)',
    pageid: 12345,
    extract: 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript.',
    extract_html: '<p>Angular is a platform and framework for building single-page client applications using HTML and TypeScript.</p>',
    thumbnail: {
      source: 'https://example.com/angular-logo.png',
      width: 200,
      height: 200
    },
    lang: 'en',
    content_urls: {
      desktop: {
        page: 'https://en.wikipedia.org/wiki/Angular_(web_framework)',
        revisions: 'https://en.wikipedia.org/wiki/Angular_(web_framework)?action=history',
        edit: 'https://en.wikipedia.org/wiki/Angular_(web_framework)?action=edit',
        talk: 'https://en.wikipedia.org/wiki/Talk:Angular_(web_framework)'
      },
      mobile: {
        page: 'https://en.m.wikipedia.org/wiki/Angular_(web_framework)',
        revisions: 'https://en.m.wikipedia.org/wiki/Angular_(web_framework)?action=history',
        edit: 'https://en.m.wikipedia.org/wiki/Angular_(web_framework)?action=edit',
        talk: 'https://en.m.wikipedia.org/wiki/Talk:Angular_(web_framework)'
      }
    }
  };

  beforeEach(async () => {
    selectedArticleSubject = new BehaviorSubject<WikipediaSearchResult | null>(null);
    
    const wikiServiceSpy = jasmine.createSpyObj('WikiService', ['getArticleSummary'], {
      selectedArticle$: selectedArticleSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [WikiSummaryComponent],
      providers: [
        { provide: WikiService, useValue: wikiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WikiSummaryComponent);
    component = fixture.componentInstance;
    mockWikiService = TestBed.inject(WikiService) as jasmine.SpyObj<WikiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.selectedArticle).toBeNull();
      expect(component.summary).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('');
    });
  });

  describe('Component Initialization', () => {
    it('should navigate to home when no article is selected', fakeAsync(() => {
      selectedArticleSubject.next(null);
      
      component.ngOnInit();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should fetch summary when article is selected', fakeAsync(() => {
      mockWikiService.getArticleSummary.and.returnValue(of(mockSummary));
      
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();

      expect(component.selectedArticle).toEqual(mockArticle);
      expect(mockWikiService.getArticleSummary).toHaveBeenCalledWith(mockArticle.title);
      expect(component.summary).toEqual(mockSummary);
    }));

    it('should handle error when fetching summary fails', fakeAsync(() => {
      mockWikiService.getArticleSummary.and.returnValue(throwError(() => new Error('API Error')));
      
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();

      expect(component.errorMessage).toBe('Failed to load article summary. Please try again.');
      expect(component.summary).toBeNull();
    }));
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      mockWikiService.getArticleSummary.and.returnValue(of(mockSummary));
    });

    it('should render back button and page title', fakeAsync(() => {
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();

      const backBtn = fixture.debugElement.query(By.css('.back-btn'));
      const pageTitle = fixture.debugElement.query(By.css('.page-title'));

      expect(backBtn).toBeTruthy();
      expect(pageTitle.nativeElement.textContent).toContain('Article Summary');
    }));

    it('should render loading state', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingSection = fixture.debugElement.query(By.css('.loading-section'));
      const loadingSpinner = fixture.debugElement.query(By.css('.loading-spinner'));
      const loadingText = fixture.debugElement.query(By.css('.loading-text'));

      expect(loadingSection).toBeTruthy();
      expect(loadingSpinner).toBeTruthy();
      expect(loadingText.nativeElement.textContent).toContain('Loading article summary...');
    });      it('should render error state', fakeAsync(() => {
      // Setup error scenario
      mockWikiService.getArticleSummary.and.returnValue(throwError(() => new Error('Test error')));
      
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();

      const errorSection = fixture.debugElement.query(By.css('.error-section'));
      const errorMessage = fixture.debugElement.query(By.css('.error-message'));

      expect(errorSection).toBeTruthy();
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.nativeElement.textContent).toContain('Failed to load article summary');
    }));
    it('should render article summary content', fakeAsync(() => {
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();

      const articleTitle = fixture.debugElement.query(By.css('.article-title'));
      const extractText = fixture.debugElement.query(By.css('.extract-text'));
      const thumbnailImage = fixture.debugElement.query(By.css('.thumbnail-image'));

      expect(articleTitle).toBeTruthy();
      expect(articleTitle.nativeElement.textContent).toBe(mockSummary.title);
      
      expect(extractText).toBeTruthy();
      expect(extractText.nativeElement.textContent).toBe(mockSummary.extract);
      
      expect(thumbnailImage).toBeTruthy();
      expect(thumbnailImage.nativeElement.src).toBe(mockSummary.thumbnail!.source);
    }));    
    it('should render article statistics', fakeAsync(() => {
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();

      const statCards = fixture.debugElement.queryAll(By.css('.stat-card'));
      expect(statCards.length).toBe(3);

      const statValues = statCards.map(card => 
        card.query(By.css('.stat-value')).nativeElement.textContent.trim()
      );
      
      expect(statValues).toContain('43.9 KB');
      expect(statValues).toContain('3.5k words');
      expect(statValues).toContain('#12345');
    }));    
    it('should render action buttons', fakeAsync(() => {
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();

      // Look specifically in the summary content section for action buttons
      const summaryContent = fixture.debugElement.query(By.css('.summary-content'));
      expect(summaryContent).toBeTruthy();
      
      const actionButtons = summaryContent.queryAll(By.css('.action-btn'));
      expect(actionButtons.length).toBe(2);

      const buttonTexts = actionButtons.map(btn => {
        const btnTextElement = btn.query(By.css('.btn-text'));
        expect(btnTextElement).toBeTruthy();
        return btnTextElement.nativeElement.textContent.trim();
      });
      
      expect(buttonTexts).toContain('Read Full Article');
      expect(buttonTexts).toContain('Back to Search');
    }));

    it('should render no article selected state', () => {
      component.selectedArticle = null;
      component.isLoading = false;
      component.errorMessage = '';
      fixture.detectChanges();

      const noArticleSection = fixture.debugElement.query(By.css('.no-article-section'));
      const noArticleTitle = fixture.debugElement.query(By.css('.no-article-title'));

      expect(noArticleSection).toBeTruthy();
      expect(noArticleTitle.nativeElement.textContent).toContain('No Article Selected');
    });
  });

  describe('User Interactions', () => {
    beforeEach(fakeAsync(() => {
      mockWikiService.getArticleSummary.and.returnValue(of(mockSummary));
      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();
      fixture.detectChanges();
    }));

    it('should navigate back when back button is clicked', () => {
      const backBtn = fixture.debugElement.query(By.css('.back-btn'));
      
      backBtn.nativeElement.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should navigate back when secondary action button is clicked', () => {
      const secondaryBtn = fixture.debugElement.query(By.css('.secondary-btn'));
      
      secondaryBtn.nativeElement.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should open full article when primary action button is clicked', () => {
      spyOn(window, 'open');
      const primaryBtn = fixture.debugElement.query(By.css('.primary-btn'));
      
      primaryBtn.nativeElement.click();

      expect(window.open).toHaveBeenCalledWith(
        'https://en.wikipedia.org/?curid=12345',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('should retry fetching summary when retry button is clicked', fakeAsync(() => {
      component.errorMessage = 'Test error';
      component.isLoading = false;
      fixture.detectChanges();

      const retryBtn = fixture.debugElement.query(By.css('.retry-btn'));
      mockWikiService.getArticleSummary.calls.reset();
      
      retryBtn.nativeElement.click();
      tick();

      expect(mockWikiService.getArticleSummary).toHaveBeenCalledWith(mockArticle.title);
    }));
  });

  describe('Helper Methods', () => {
    it('should format date correctly', () => {
      const formattedDate = component.formatDate('2023-12-15T10:30:00Z');
      expect(formattedDate).toContain('December 15, 2023');
    });

    it('should handle invalid date gracefully', () => {
      const formattedDate = component.formatDate('invalid-date');
      expect(formattedDate).toBe('Unknown date');
    });

    it('should format file size correctly', () => {
      expect(component.formatSize(1024)).toBe('1.0 KB');
      expect(component.formatSize(1048576)).toBe('1.0 MB');
      expect(component.formatSize(500)).toBe('500 bytes');
    });

    it('should format word count correctly', () => {
      expect(component.formatWordCount(500)).toBe('500 words');
      expect(component.formatWordCount(1500)).toBe('1.5k words');
    });
  });

  describe('Component Lifecycle', () => {
    it('should complete destroy subject on ngOnDestroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });    it('should unsubscribe from observables on destroy', fakeAsync(() => {
      // Setup a delayed summary response
      const summarySubject = new Subject<WikipediaSummary>();
      mockWikiService.getArticleSummary.and.returnValue(summarySubject);
      
      component.ngOnInit();
      
      // Trigger article selection which starts the summary fetch
      selectedArticleSubject.next(mockArticle);
      tick();
      
      // Verify loading state is set and summary is null
      expect(component.isLoading).toBe(true);
      expect(component.summary).toBeNull();
      
      // Destroy component before observable completes
      component.ngOnDestroy();
      
      // Try to emit summary data after component is destroyed
      summarySubject.next(mockSummary);
      summarySubject.complete();
      tick();

      // Component state should not be updated after destruction
      // Both the summary should remain null and loading should be reset by finalize
      expect(component.summary).toBeNull();
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('Accessibility', () => {
    beforeEach(fakeAsync(() => {
      mockWikiService.getArticleSummary.and.returnValue(of(mockSummary));
      component.selectedArticle = mockArticle;
      component.summary = mockSummary;
      component.isLoading = false;
      fixture.detectChanges();
    }));      it('should have proper ARIA labels on buttons', () => {
      // Ensure component state is properly set
      component.selectedArticle = mockArticle;
      component.summary = mockSummary;
      component.isLoading = false;
      component.errorMessage = '';
      fixture.detectChanges();

      const backBtn = fixture.debugElement.query(By.css('.back-btn'));
      const primaryBtn = fixture.debugElement.query(By.css('.primary-btn'));

      expect(backBtn).toBeTruthy();
      expect(primaryBtn).toBeTruthy();
      expect(backBtn.nativeElement.getAttribute('aria-label')).toBe('Go back to search results');
      expect(primaryBtn.nativeElement.getAttribute('aria-label')).toBe('Read full article: Angular (web framework) on Wikipedia');
    });

    it('should have proper role attributes for loading and error states', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingSection = fixture.debugElement.query(By.css('.loading-section'));
      expect(loadingSection.nativeElement.getAttribute('role')).toBe('status');
      expect(loadingSection.nativeElement.getAttribute('aria-live')).toBe('polite');

      component.isLoading = false;
      component.errorMessage = 'Test error';
      fixture.detectChanges();

      const errorSection = fixture.debugElement.query(By.css('.error-section'));
      expect(errorSection.nativeElement.getAttribute('role')).toBe('alert');
      expect(errorSection.nativeElement.getAttribute('aria-live')).toBe('assertive');
    });    it('should have proper alt text for thumbnail image', () => {
      component.selectedArticle = mockArticle;
      component.summary = mockSummary;
      component.isLoading = false;
      component.errorMessage = '';
      fixture.detectChanges();

      const thumbnailImage = fixture.debugElement.query(By.css('.thumbnail-image'));
      expect(thumbnailImage).toBeTruthy();
      expect(thumbnailImage.nativeElement.alt).toBe('Thumbnail for Angular (web framework)');
    });
  });

  describe('Error Handling', () => {    it('should handle error in selected article subscription', fakeAsync(() => {
      spyOn(console, 'error');
      const errorSubject = new Subject<WikipediaSearchResult | null>();
      
      Object.defineProperty(mockWikiService, 'selectedArticle$', {
        value: errorSubject.asObservable()
      });

      component.ngOnInit();
      errorSubject.error(new Error('Subscription error'));
      tick();

      expect(console.error).toHaveBeenCalled();
      expect(component.errorMessage).toBe('Failed to load article summary. Please try again.');
    }));it('should set loading state correctly during summary fetch', fakeAsync(() => {
      const summarySubject = new Subject<WikipediaSummary>();
      mockWikiService.getArticleSummary.and.returnValue(summarySubject);

      component.ngOnInit();
      selectedArticleSubject.next(mockArticle);
      tick();

      expect(component.isLoading).toBe(true);
      expect(component.errorMessage).toBe('');

      summarySubject.next(mockSummary);
      summarySubject.complete();
      tick();

      expect(component.isLoading).toBe(false);
    }));
  });
});

// test code generated by AI
