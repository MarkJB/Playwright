import { expect, Page, test as base } from "@playwright/test";
import { PageObjectModel } from "./pageObjectModel";

// These could be made into fixtures... Lets duplicate them and provide both utils and fixtures

// Login utility function
export const login = async (
  page: Page,
  username: string = "standard_user",
  password: string = "secret_sauce"
) => {
  const pom = new PageObjectModel(page);
  // Fill in the username and password fields with locked out user credentials
  await pom.login.usernameInput().fill(username);
  await pom.login.passwordInput().fill(password);

  // Click the login button
  await pom.login.loginButton().click();
};

// login fixture
export const testLogin = base.extend<{
  authenticatedPage: Page;
  userCredentials: { username: string; password: string };
}>({
  userCredentials: [
    { username: "standard_user", password: "secret_sauce" },
    { scope: "test" },
  ],
  authenticatedPage: async ({ page, userCredentials }, use) => {
    // Call the login utility function to log in before each test
    // We can pass in different user credentials from the fixture with
    // test.use( userCredentials: { username: "other_user", password: "other_secret" } )
    await login(page, userCredentials.username, userCredentials.password);
    // Hand off to the test
    await use(page);
  },
});

export const selectProduct = async (
  page: Page,
  product: string | undefined = "Sauce Labs Backpack"
) => {
  const pom = new PageObjectModel(page);
  // Helper function to select a product from the products inventory page
  // (don't forget to call this function with await or your test will not wait for it to complete)
  await expect(pom.inventory.title()).toHaveText("Products");
  await page.getByText(product).click();
  await expect(pom.inventoryItem.name()).toHaveText("Sauce Labs Backpack");
};
