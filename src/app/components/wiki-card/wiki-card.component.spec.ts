import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiCardComponent } from './wiki-card.component';
import { WikipediaSearchResult } from '../../interfaces/wikipedia-search-result';
import { By } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

describe('WikiCardComponent', () => {
  let component: WikiCardComponent;
  let fixture: ComponentFixture<WikiCardComponent>;

  const mockArticle: WikipediaSearchResult = {
    pageid: 123,
    title: 'Test Article',
    snippet: 'This is a <span class="searchmatch">test</span> snippet.',
    timestamp: '2024-05-30T10:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WikiCardComponent], // Import the standalone component
      providers: [DatePipe] // Provide DatePipe if used in the template
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display article title, snippet and timestamp when article is provided', () => {
    component.article = mockArticle;
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('.card-title'));
    expect(titleElement.nativeElement.textContent).toBe(mockArticle.title);

    const contentElement = fixture.debugElement.query(By.css('.card-content'));
    // Check innerHTML for the snippet as it contains HTML
    expect(contentElement.nativeElement.innerHTML).toBe(mockArticle.snippet);

    const timestampElement = fixture.debugElement.query(By.css('.card-timestamp small'));
    const datePipe = new DatePipe('en-US');
    expect(timestampElement.nativeElement.textContent).toBe('Last updated: ' + datePipe.transform(mockArticle.timestamp, 'medium'));
  });

  it('should not display card content if article is not provided', () => {
    component.article = undefined;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.card'));
    expect(cardElement).toBeNull();
  });
});
