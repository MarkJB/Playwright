import { test, expect } from "@playwright/test";
import { login, selectProduct } from "../utils/utils";
import { faker } from "@faker-js/faker";
import { PageObjectModel } from "../utils/pageObjectModel";

test.beforeEach(async ({ page }) => {
  const pom = new PageObjectModel(page);
  // Navigate to the login page before each test
  await page.goto("https://www.saucedemo.com/");
  // Login with default credentials
  await login(page);
  // Verify that we are on the inventory page
  await expect(pom.inventory.title()).toHaveText("Products");
  // Add default product to the cart
  await selectProduct(page);

  // Go to the cart
  await pom.inventory.shoppingCartIconButton().click();

  // Proceed to checkout
  await pom.cart.checkoutButton().click();

  // Verify that the checkout form is displayed
  await expect(pom.cart.title()).toHaveText("Checkout: Your Information");
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
    const pom = new PageObjectModel(page);
    // Fill in the checkout form with the provided customer data
    if (firstName) {
      await pom.cart.firstNameInput().fill(firstName);
    }
    if (lastName) {
      await pom.cart.lastNameInput().fill(lastName);
    }
    if (postalCode) {
      await pom.cart.postalCodeInput().fill(postalCode);
    }

    // Submit the form
    await pom.cart.continueButton().click();

    // Verify that an error message is displayed
    await expect(pom.cart.errorMessage(message)).toBeVisible();
    // await expect(page.getByText(message)).toBeVisible();
  });
});
