# A refresher of playwright

This is an attempt at quickly creating a test suite for https://saucedemo.com/ (Sauce Labs test demo site).

It was not intended to provide 100% test coverage, but was an exercise in starting from scratch again, re-familiarizing myself with Playwright & Typescript (not that it needed much Typescript - seems to be inferred well enough).

I hit a few Gotchas that I remember hitting in the past like using async inside `.forEach` tests\*, or `map()` with other logic (Note: both `map()` and `[]forEach()` work fine if you are calling `test()` within it in a synchronous way (i.e. not calling it with async - see note below)).

I originally stated "I should get used to using `for (const x of y) {}` for parametrized tests", but the Playwright documentation shows [].forEach(), and as long as I stick with what I said in the note below, `[]forEach()` should be fine.

I looked into fixtures which I've not really done before - they are not like Pytest fixtures. They are more opaque and don't play nice with parametrized tests and `.use()` (Passing parametrized data to a fixture in a loop will override that data for all tests, and if they are running in parallel, its not going to end well).

- Note: The `forEach()` function should take an synchronous function e.g. `someArray.forEach((item) => test('Some test ${item.name}', async () => { // This bit being async is fine } ))`. The forEach should not take an async test function e.g. `someArray.forEach(async (item) => test('Some test ${item.name}', async () => { // This bit being async is fine } ))` (note the async directly after the `forEach(`, this might appear tow work but can result in unexpected behaviour).

## Setup

Should just be able to run `npm ci` to install everything.

## Running tests

From Github, go to actions and view an existing run or trigger a new run if you have permissions on the repo.

From the command line, `npx playwright test`

This should test on Chrome, Firefox & Webkit (you might need to install the playwright browsers though `npx playwright install`)

## License

This project is licensed under the MIT License — see the LICENSE file for details.
