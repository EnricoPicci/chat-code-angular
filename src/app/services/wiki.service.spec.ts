import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { WikiService } from './wiki.service';

describe('WikiService', () => {
  let service: WikiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WikiService,
        provideHttpClient() // Provide HttpClient for real HTTP calls
      ]
    });
    service = TestBed.inject(WikiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch Wikipedia article summary', (done: DoneFn) => {
    const searchTerm = 'Angular_(web_framework)';
    service.getArticleSummary(searchTerm).subscribe({
      next: response => {
        expect(response).toBeTruthy();
        expect(response.title).toBe('Angular (web framework)');
        expect(response.extract).toBeDefined(); // Changed from snippet to extract
        done();
      },
      error: err => {
        done.fail(err); // Fail the test if the HTTP request errors
      }
    });
  }, 10000); // Keep a reasonable timeout for real network requests
});
