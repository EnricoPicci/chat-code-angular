# Wikipedia Search App - Architecture Diagram

## Component Dependencies and Data Flow

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor': '#FFFFFF', 'primaryTextColor': '#000000', 'primaryBorderColor': '#424242', 'lineColor': '#424242', 'sectionBkgColor': '#F5F5F5', 'altSectionBkgColor': '#E0E0E0', 'gridColor': '#BDBDBD'}}}%%
graph TB
    %% Main Application Structure
    AppComponent["AppComponent<br/>Root Component<br/>- RouterOutlet"]
    
    AppRoutes["App Routes<br/>Routing Configuration<br/>- / → /search<br/>- /search → WikipediaSearchComponent<br/>- /** → /search"]
    
    AppConfig["App Config<br/>Application Configuration<br/>- HTTP Client Provider<br/>- Router Provider<br/>- Animations Provider"]

    %% Main Page Component
    WikipediaSearchComponent["WikipediaSearchComponent<br/>Main Page Component<br/>- searchState: SearchState<br/>- onSearchTermChanged()<br/>- searchArticles()<br/>- ngOnDestroy()"]

    %% Child Components
    SearchBarComponent["SearchBarComponent<br/>Search Input Component<br/>- searchControl: FormControl<br/>- @Output searchTermChanged<br/>- onSearch()<br/>- onKeyPress()<br/>- clearSearch()"]

    ResultsListComponent["ResultsListComponent<br/>Results Display Component<br/>- @Input results<br/>- @Input isLoading<br/>- @Input error<br/>- @Input hasSearched<br/>- openArticle()<br/>- trackByUrl()"]

    %% Services
    WikipediaService["WikipediaService<br/>API Service<br/>- searchArticles()<br/>- transformApiResponse()<br/>- stripHtmlTags()"]

    %% Models/Interfaces
    WikipediaModels["Wikipedia Models<br/>Type Definitions<br/>- WikipediaSearchResult<br/>- WikipediaApiResponse<br/>- SearchState"]

    %% External Dependencies
    HttpClient["HttpClient<br/>Angular HTTP Client<br/>- HTTP requests to Wikipedia API"]

    WikipediaAPI["Wikipedia API<br/>External REST API<br/>- en.wikipedia.org/w/api.php"]

    %% Angular Material Components
    MaterialComponents["Angular Material<br/>UI Components<br/>- MatToolbar<br/>- MatFormField<br/>- MatInput<br/>- MatButton<br/>- MatIcon<br/>- MatCard<br/>- MatProgressSpinner"]

    %% RxJS Operators
    RxJSOperators["RxJS Operators<br/>Reactive Programming<br/>- map, catchError<br/>- takeUntil, Subject<br/>- Observable patterns"]

    %% Relationships and Dependencies
    AppComponent --> AppRoutes
    AppComponent --> AppConfig
    AppRoutes --> WikipediaSearchComponent
    
    WikipediaSearchComponent --> SearchBarComponent
    WikipediaSearchComponent --> ResultsListComponent
    WikipediaSearchComponent --> WikipediaService
    WikipediaSearchComponent --> WikipediaModels
    WikipediaSearchComponent --> RxJSOperators
    
    SearchBarComponent --> MaterialComponents
    ResultsListComponent --> MaterialComponents
    WikipediaSearchComponent --> MaterialComponents
    
    WikipediaService --> HttpClient
    WikipediaService --> WikipediaModels
    WikipediaService --> RxJSOperators
    
    HttpClient --> WikipediaAPI
      %% Styling with high contrast for better readability
    classDef component fill:#2196F3,stroke:#0D47A1,stroke-width:3px,color:#FFFFFF
    classDef service fill:#9C27B0,stroke:#4A148C,stroke-width:3px,color:#FFFFFF
    classDef model fill:#4CAF50,stroke:#1B5E20,stroke-width:3px,color:#FFFFFF
    classDef external fill:#FF9800,stroke:#E65100,stroke-width:3px,color:#FFFFFF
    classDef config fill:#E91E63,stroke:#880E4F,stroke-width:3px,color:#FFFFFF

    class AppComponent,WikipediaSearchComponent,SearchBarComponent,ResultsListComponent component
    class WikipediaService service
    class WikipediaModels model
    class HttpClient,WikipediaAPI,MaterialComponents,RxJSOperators external
    class AppRoutes,AppConfig config
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant SearchBar as SearchBarComponent
    participant MainPage as WikipediaSearchComponent
    participant Service as WikipediaService
    participant API as Wikipedia API
    participant Results as ResultsListComponent

    User->>SearchBar: Enter search term
    SearchBar->>SearchBar: Validate input
    User->>SearchBar: Click search or press Enter
    SearchBar->>MainPage: Emit searchTermChanged event
    
    MainPage->>MainPage: Update searchState (loading: true)
    MainPage->>Service: Call searchArticles(searchTerm)
    
    Service->>Service: Validate search term
    Service->>API: HTTP GET request with search params
    API-->>Service: Return Wikipedia API response
    
    alt Success
        Service->>Service: Transform API response
        Service->>Service: Clean HTML from snippets
        Service-->>MainPage: Return WikipediaSearchResult[]
        MainPage->>MainPage: Update searchState (results, loading: false)
        MainPage->>Results: Pass results via @Input
        Results->>User: Display search results
    else Error
        Service-->>MainPage: Return error
        MainPage->>MainPage: Update searchState (error, loading: false)
        MainPage->>Results: Pass error via @Input
        Results->>User: Display error message
    end

    User->>Results: Click "Read Article"
    Results->>Results: Open Wikipedia URL in new tab
```

## Component Architecture Overview

### **Core Components Structure**

1. **AppComponent** (Root)
   - Minimal root component with RouterOutlet
   - Entry point for the application

2. **WikipediaSearchComponent** (Page)
   - Main container component
   - Manages search state and orchestrates child components
   - Handles business logic and data flow

3. **SearchBarComponent** (Feature)
   - Reusable search input component
   - Emits search events to parent
   - Handles user input validation

4. **ResultsListComponent** (Feature)
   - Displays search results in cards
   - Handles loading, error, and empty states
   - Responsive design with accessibility features

### **Services Layer**

1. **WikipediaService**
   - Encapsulates Wikipedia API interactions
   - Transforms API responses to application models
   - Handles error scenarios and data cleaning

### **Models and Types**

1. **Wikipedia Models**
   - Type-safe interfaces for API responses
   - Application-specific result models
   - Search state management types

### **Key Design Patterns Used**

- **Component Communication**: Parent-child via @Input/@Output
- **Service Injection**: Dependency injection for API service
- **Observable Patterns**: RxJS for async data handling
- **Reactive Forms**: FormControl for search input
- **Standalone Components**: Angular v19 approach
- **Lazy Loading**: Route-based component loading
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

### **External Dependencies**

- **Angular Material**: UI component library
- **RxJS**: Reactive programming utilities
- **Angular HTTP Client**: API communication
- **Wikipedia API**: External data source

### **Benefits of This Architecture**

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused or replaced
3. **Testability**: Services and components are easily unit testable
4. **Maintainability**: Clear dependency structure and modular design
5. **Type Safety**: TypeScript interfaces ensure data consistency
6. **Performance**: Lazy loading and OnPush change detection
7. **Accessibility**: Built-in a11y features throughout
8. **Responsive**: Mobile-first design approach

## File Structure Overview

```
src/app/
├── components/           # Reusable UI components
│   ├── search-bar/      # Search input component
│   └── results-list/    # Results display component
├── pages/               # Page-level components
│   └── wikipedia-search/ # Main search page
├── services/            # Business logic and API calls
│   └── wikipedia.service.ts
├── models/              # TypeScript interfaces
│   └── wikipedia.model.ts
├── app.component.*      # Root component
├── app.config.ts        # App configuration
└── app.routes.ts        # Routing configuration
```

*code generated by AI*
