import { expect } from "@playwright/test";
import { login, test } from "../utils/utils";
import { faker } from "@faker-js/faker";

test("Login, add product to cart and checkout", async ({ page, pom }) => {
  // Scenario: Can complete a product purchase.
  // Given I am logged in
  // When I add a product to the cart, and proceed to checkout
  // Then I should be able to complete the purchase successfully

  await page.goto("https://www.saucedemo.com/");
  await login(page);

  // Verify that we are on the inventory page
  await expect(pom.inventory.title()).toHaveText("Products");

  // Add a product to the cart (There are two options here, add directly from inventory or from the details page)
  await pom.inventory.productByName("Sauce Labs Backpack").click();
  await pom.inventoryItem.addToCartButton().click();

  // Go to the cart
  await pom.inventory.shoppingCartIconButton().click();
  // note: if these elements were using the custom attribute data-testid,
  // we could use page.getByTestId("shopping-cart-link").click(); instead.

  // Proceed to checkout
  await pom.cart.checkoutButton().click();

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const postalCode = faker.location.zipCode();

  // Fill in checkout form
  await pom.cart.firstNameInput().fill(firstName);
  await pom.cart.lastNameInput().fill(lastName);
  await pom.cart.postalCodeInput().fill(postalCode);

  // Submit information
  await pom.cart.continueButton().click();

  // Verify checkout overview (We might want to verify the product details here as well, depends on what is important)
  await expect(pom.cart.title()).toHaveText("Checkout: Overview");

  // Complete purchase
  await pom.cart.finishButton().click();

  // Verify order confirmation
  await expect(pom.cart.completeHeader()).toHaveText(
    "Thank you for your order!"
  );

  await expect(pom.cart.completeText()).toHaveText(
    "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  );
});
