// import { test, expect } from "@playwright/test";
import { expect } from "@playwright/test";
import { login, test } from "../utils/utils";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("https://www.saucedemo.com/");
  });

  // Parametrization is an option here, but for simplicity, we will keep the tests separate.
  // We could create an array with the username, password, and expected results, passing that to
  // a single test function. See example at the end of this file.

  test("Login with valid credentials", async ({ pom }) => {
    await pom.login.usernameInput().fill("standard_user");
    await pom.login.passwordInput().fill("secret_sauce");
    await pom.login.loginButton().click();
    await expect(pom.inventory.title()).toHaveText("Products");
  });

  test("Login with invalid username", async ({ pom }) => {
    await pom.login.usernameInput().fill("invalid_user");
    await pom.login.passwordInput().fill("secret_sauce");
    await pom.login.loginButton().click();
    await expect(
      pom.login.errorMessage(
        "Epic sadface: Username and password do not match any user in this service"
      )
    ).toBeVisible();
  });

  test("Login with invalid password", async ({ pom }) => {
    await pom.login.usernameInput().fill("standard_user");
    await pom.login.passwordInput().fill("invalid_password");
    await pom.login.loginButton().click();
    await expect(
      pom.login.errorMessage(
        "Epic sadface: Username and password do not match any user in this service"
      )
    ).toBeVisible();
  });

  test("Login with both invalid username and password", async ({ pom }) => {
    await pom.login.usernameInput().fill("invalid_user");
    await pom.login.passwordInput().fill("invalid_password");
    await pom.login.loginButton().click();
    await expect(
      pom.login.errorMessage(
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
  {
    username: "locked_out_user",
    password: "secret_sauce",
    expected: "Epic sadface: Sorry, this user has been locked out",
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
      pom,
    }) => {
      // We can replace all of this with the login utility function
      login(page, username, password);

      // Verify that the expected message is displayed
      await expect(pom.login.errorMessage(expected)).toBeVisible();
    });
  });
});
