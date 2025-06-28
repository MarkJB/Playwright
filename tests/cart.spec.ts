import { test, expect } from "@playwright/test";
import { login, selectProduct } from "../utils/utils";
import { faker } from "@faker-js/faker";

test.beforeEach(async ({ page }) => {
  // Navigate to the login page before each test
  await page.goto("https://www.saucedemo.com/");
  // Login with default credentials
  await login(page);
  // Verify that we are on the inventory page
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");
  // Add default product to the cart
  await selectProduct(page);

  // Go to the cart
  await page.locator('[data-test="shopping-cart-link"]').click();

  // Proceed to checkout
  await page.getByRole("button", { name: "Checkout" }).click();

  // Verify that the checkout form is displayed
  await expect(page.locator('[data-test="title"]')).toHaveText(
    "Checkout: Your Information"
  );
});

// After creating a few permutations of the checkout process, it feels like this
// would be cleaner as a parameterized test

const customerInfo = [
  {
    title: "Valid Customer",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
    message: "Checkout: Overview",
  },
  {
    title: "No Customer Data",
    firstName: undefined,
    lastName: undefined,
    postalCode: undefined,
    message: "Error: First Name is required",
  },
  {
    title: "First Name Only",
    firstName: faker.person.firstName(),
    lastName: undefined,
    postalCode: undefined,
    message: "Error: Last Name is required",
  },
  {
    title: "No zip code",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: undefined,
    message: "Error: Postal Code is required",
  },
];

customerInfo.forEach(({ title, firstName, lastName, postalCode, message }) => {
  test(`Checkout with ${title}`, async ({ page }) => {
    // Fill in the checkout form with the provided customer data
    if (firstName) {
      await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
    }
    if (lastName) {
      await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
    }
    if (postalCode) {
      await page
        .getByRole("textbox", { name: "ZIP/Postal Code" })
        .fill(postalCode);
    }

    // Submit the form
    await page.getByRole("button", { name: "Continue" }).click();

    // Verify that an error message is displayed
    await expect(page.getByText(message)).toBeVisible();
  });
});
