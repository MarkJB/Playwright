import { test, expect } from "@playwright/test";
import { login } from "../utils/utils";
import { faker } from "@faker-js/faker";

test("Login, add product to cart and checkout", async ({ page }) => {
  // Scenario: Can complete a product purchase.
  // Given I am logged in
  // When I add a product to the cart, and proceed to checkout
  // Then I should be able to complete the purchase successfully

  await page.goto("https://www.saucedemo.com/");
  await login(page);

  // Verify that we are on the inventory page
  await expect(page.locator('[data-test="title"]')).toHaveText("Products");

  // Add a product to the cart
  await page.getByText("Sauce Labs Backpack").click();
  await page.getByRole("button", { name: "Add to cart" }).click();

  // Go to the cart
  await page.locator('[data-test="shopping-cart-link"]').click();
  // note: if these elements were using the custom attribute data-testid,
  // we could use page.getByTestId("shopping-cart-link").click(); instead.

  // Proceed to checkout
  await page.getByRole("button", { name: "Checkout" }).click();

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const postalCode = faker.location.zipCode();

  // Fill in checkout form
  await page.getByRole("textbox", { name: "First Name" }).fill(firstName);
  await page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
  await page.getByRole("textbox", { name: "ZIP/Postal Code" }).fill(postalCode);

  // Submit information
  await page.getByRole("button", { name: "Continue" }).click();

  // Verify checkout overview (We might want to verify the product details here as well, depends on what is important)
  await expect(page.locator('[data-test="title"]')).toHaveText(
    "Checkout: Overview"
  );

  // Complete purchase
  await page.getByRole("button", { name: "Finish" }).click();

  // Verify order confirmation
  await expect(page.locator('[data-test="complete-header"]')).toHaveText(
    "Thank you for your order!"
  );

  await expect(page.locator('[data-test="complete-text"]')).toHaveText(
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  );
});
