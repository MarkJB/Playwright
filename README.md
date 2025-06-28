# A refresher of playwright

This is an attempt at quickly creating a test suite for https://saucedemo.com/ (Sauce Labs test demo site).

It was not intended to provide 100% test coverage, but was an exercise in starting from scratch again, re-familiarizing myself with Playwright & Typescript (not that it needed much Typescript - seems to be inferred well enough).

I hit a few Gotchas that I remember hitting in the past like using `.forEach` inside async tests, or `map()` with other logic (Note: `map()` works fine if you are only calling `test()` within it).

I should get used to using `for (const x of y) {}` for parametrized tests.

I looked into fixtures which I've not really done before - they are not like Pytest fixtures. They are more opaque and don't play nice with parametrized tests and `.use()` (Passing parametrized data to a fixture in a loop will override that data for all tests, and if they are running in parallel, its not going to end well).

## Setup

Should just be able to run `npm ci` to install everything.

## Running tests

From the command line, `npx playwright test`

This should test on Chrome, Firefox & Webkit (you might need to install the playwright browsers though `npx playwright install`)

## License

This project is licensed under the MIT License — see the LICENSE file for details.
