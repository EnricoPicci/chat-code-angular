# Create the app that query the Wikipediat API to fetch articles that match a search term and show the results in a list.

# Use a step-by-step strategy

## Step 1: Create WikiService

Create WikiService and add to it a method that would serve as API to fetch the Wikipedia articles given a certain search term.
Use the latest APIs provided by Wikipedia.
Add also a test for this API. Do not use mocks for the test but use the real API.

## Step 2: Add the fetch summary mewthod to the WikiService

Add to WikiService a method that would serve as API to fetch the summary of a Wikipedia article given its title.
Use the latest APIs provided by Wikipedia.
Add also a test for this API. Do not use mocks for the test but use the real API.

## Step 3: Create WikiCardComponent

Create WikiCard component, which is a component that shows a single Wikipedia article as a card in the list. A Wikipedia article is an object described the the interface WikipediaSearchResult - it will be used by the WikiList component to build the grid of retrieved articles.

## Step 4: Create WikiListComponent

Create WikiList component, which is a component that shows a list of Wikipedia articles as cards.
It will use the WikiCard component to show each article in the list.
The component has a search field that allows the user to search for articles by a search term.
The component has a button that allows the user to fetch the articles from the Wikipedia API.
The click event of the button should call the WikiService to fetch the articles.

## Step 5: set WikiListComponent as the main component loaded by the app at the start

add WikiList as the page loaded at the start of the application

## Step 6: Generate a WikiSummaryComponent
Create WikiSummary component, which is a component that shows the summary of a Wikipedia article.
The component will have to show a summary of the article and also all the other information that is available in the WikipediaSearchResult object.
Add a "Summary" button to the WikiCard component that will navigate to the WikiSummary component when clicked.
The retrival of the summary from the WikiService should be done in the WikiSummary component.
When the WikiSummary component is loaded, it should:
- subscribe to an Observable exposed by the WikiService that will emit the article selected by the user.
- call the WikiService to fetch the summary of the article.
- show the summary in the component.
Since the mechanism to pass the selected article is reactive, there is no need to pass the article as a parameter to the WikiSummary using the router.

### Fix where the WikipediaSummary interface is defined
The Wikipedia summary interface should be moved to the WikiService class.
Make sure that the tests of WikiService compile and work.

### Fix subscription within subscription 
this is not good rxJs idiomatic code since there is a subcription within a subscription. fix the code so that there is just one subscription through which, when selectedArticle$ notifies a new selected article, the fetchSummary logic is performed