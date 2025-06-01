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