# Propts sent and following prompts to fix issues

## Step 1: Create WikiService

Create WikiService and add to it a method that would serve as API to fetch the Wikipedia articles given a certain search term.
Use the latest APIs provided by Wikipedia.
Add also a test for this API. Do not use mocks for the test but use the real API.

## Fix prompt 1
### The wiki service test was failing with a timeout error.
### The agent has wiki.service.spec.ts in the context
this test has deprecated and unused imports and fails with error\
Error: Timeout - Async function did not complete within 5000ms

fix it

## Fix prompt 1
### A second attempt was required to fix the test.
### The agent has wiki.service.spec.ts in the context
the test imports HttpClientTestingModule which is deprecated and still fails with error\
Error: Timeout - Async function did not complete within 10000ms

Increasing the timeout is not the solution. Fix the root cause of the error.

## Step 2: Create WikiCardComponent

Create WikiCard component, which is a component that shows a single Wikipedia article as a card in the list. A Wikipedia article is an object described the the interface WikipediaSearchResult - it will be used by the WikiList component to build the grid of retrieved articles.

## Fix prompt 2
### While generating the WikiCard component the agent has generated also an interface to model WikipediaSearchResult, but uses this interface only in the component and not in the service.

WikipediaSearchResult must be used to type the response of the API of wiki service

### While adding WikipediaSearchResult to type the response of the API of wiki service, the agent has introduced compilations errors and errors in the tests (e.g. using references to a "snippet" property of WikipediaSearchResult which was not defined). It took 3 iterations to fix the issues. The last prompt was:
there are still references to snippet property in wiki-card test and wiki service test. Fix the compilation errors and do not generate new errors. Make sure you fix everything.