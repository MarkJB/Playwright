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

### Github

Go to actions and view an existing run or trigger a new run if you have permissions on the repo.

### Command line

`npx playwright test`

This should test on Chrome, Firefox & Webkit (you might need to install the playwright browsers though `npx playwright install`)

## License

This project is licensed under the MIT License — see the LICENSE file for details.

## Next steps?

What would I add next?

The login page lists a number of different users that result in different UI behaviour such as a locked out user or glitch or other errors. We should try and test those. Some might be as simple as updating the test data for the existing login test, but others would require dedicated tests.

Note: Added locked_out_user test in [e4d073896ba7d4a845a26fb0760bf56286ff9084](https://github.com/MarkJB/Playwright/commit/e4d073896ba7d4a845a26fb0760bf56286ff9084)
 

We could also do more extensive tests on the cart, adding multiple products, checking totals, removing products and checking totals and qtys update as expected.

It might be interesting to test visual snapshots. I haven't had much luck with that in previous teams due to differences in screenshots taken on test systems vs CI runners and lack of appetite for visual snapshots. Note: The `visual_user` appears to move some of the UI elements around so that could be used to simulate a visual snapshot failure.
