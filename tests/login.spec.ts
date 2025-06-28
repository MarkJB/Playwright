import { test, expect } from "@playwright/test";
import { login, testLogin } from "../utils/utils";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("https://www.saucedemo.com/");
  });

  // Parametrization is an option here, but for simplicity, we will keep the tests separate.
  // We could create an array with the username, password, and expected results, passing that to
  // a single test function. See example at the end of this file.

  test("Login with valid credentials", async ({ page }) => {
    // Fill in the username and password fields

    // Compare the Codegen suggested locator vs an accessible locator
    // await page.fill("#user-name", "standard_user");
    // await page.fill("#password", "secret_sauce");
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
    // Click the login button
    // await page.click("#login-button");
    await page.getByRole("button", { name: "Login" }).click();
    // Verify that the login was successful by checking for the presence of the inventory page
    //   await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.locator("[data-test='title']")).toHaveText("Products");
  });

  test("Login with invalid username", async ({ page }) => {
    // Fill in the username and password fields with invalid username
    await page.getByRole("textbox", { name: "Username" }).fill("invalid_user");
    await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");

    // Click the login button
    await page.getByRole("button", { name: "Login" }).click();

    // Verify that the error message is displayed
    await expect(
      page.getByText(
        "Epic sadface: Username and password do not match any user in this service"
      )
    ).toBeVisible();
  });

  test("Login with invalid password", async ({ page }) => {
    // Fill in the username and password fields with invalid password
    await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("invalid_password");

    // Click the login button
    await page.getByRole("button", { name: "Login" }).click();

    // Verify that the error message is displayed
    await expect(
      page.getByText(
        "Epic sadface: Username and password do not match any user in this service"
      )
    ).toBeVisible();
  });

  test("Login with both invalid username and password", async ({ page }) => {
    // Fill in the username and password fields with invalid credentials
    await page.getByRole("textbox", { name: "Username" }).fill("invalid_user");
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("invalid_password");

    // Click the login button
    await page.getByRole("button", { name: "Login" }).click();

    // Verify that the error message is displayed
    await expect(
      page.getByText(
        "Epic sadface: Username and password do not match any user in this service"
      )
    ).toBeVisible();
  });
});

// Parametrized test data
const testData = [
  {
    username: "standard_user",
    password: "secret_sauce",
    expected: "Products",
  },
  {
    username: "invalid_user",
    password: "secret_sauce",
    expected:
      "Epic sadface: Username and password do not match any user in this service",
  },
  {
    username: "standard_user",
    password: "invalid_password",
    expected:
      "Epic sadface: Username and password do not match any user in this service",
  },
  {
    username: "invalid_user",
    password: "invalid_password",
    expected:
      "Epic sadface: Username and password do not match any user in this service",
  },
];

test.describe("Parametrized Login Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("https://www.saucedemo.com/");
  });

  testData.forEach(({ username, password, expected }) => {
    test(`Login; Username: ${username}, Password: ${password}, Expectation: ${expected}`, async ({
      page,
    }) => {
      // We can replace all of this with the login utility function
      login(page, username, password);
      //   // Fill in the username and password fields with locked out user credentials
      //   await page.getByRole("textbox", { name: "Username" }).fill(username);
      //   await page.getByRole("textbox", { name: "Password" }).fill(password);

      //   // Click the login button
      //   await page.getByRole("button", { name: "Login" }).click();

      // Verify that the expected message is displayed
      await expect(page.getByText(expected)).toBeVisible();
    });
  });
});

// This is the first time I've used fixtures in Playwright.
// It is a bit different than pytest...
// The testLogin fixture is defined in the utils/utils.ts file.
// It uses the login utility function to log in before each test.
// It is called `testLogin` and is an extension of the base `test`. (Like `'test' but with a `page` that is already logged in`)
// Instead of providing a `page` to the test, we provide an `authenticatedPage` that is already logged in.
// We override the default `userCredentials` with testLogin.use(). It is expecting an object with `username` and `password` properties.
// The `authenticatedPage` is passed to the test function, which can be used to interact with the browser page as usual.

// How does this compare with test.beforeEach and calling utility functions?
// It's more opaque. Does it cut down on boilerplate code?

// Note: We could make testData a fixture as well.

// Ok this didn't work. Turns out that testLogin.use() will override the data for all tests, no matter where they are running.
// Put another way, the data is not scoped to the test, but to the entire test suite. So this doesn't work.
// More correct to say this is not the right use for fixtures or perhaps, not the right way to use fixtures.

// test.describe("Login using fixtures", () => {
//   test.beforeEach(async ({ page }) => {
//     // Navigate to the login page before each test
//     await page.goto("https://www.saucedemo.com/");
//   });
//   testData.forEach(({ username, password, expected }) => {
//     testLogin.use({
//       userCredentials: { username, password },
//     });
//     testLogin(
//       `Login; Username: ${username}, Password: ${password}, Expectation: ${expected}`,
//       async ({ authenticatedPage }) => {
//         // Verify that the expected message is displayed
//         await expect(authenticatedPage.getByText(expected)).toBeVisible();
//       }
//     );
//   });
// });
