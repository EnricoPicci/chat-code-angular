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
