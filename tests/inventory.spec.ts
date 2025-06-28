import { test, expect } from "@playwright/test";
import { selectProduct } from "../utils/utils";

test.beforeEach(async ({ page }) => {
  // Navigate to site and login before each test - should pull credentials from .env file
  await page.goto("https://www.saucedemo.com/");
  await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
  await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
});

test.describe("Products", () => {
  test("Add Product to cart", async ({ page }) => {
    // Scenario: Add a product to the cart and verify it appears in the cart icon
    // Given I am on the inventory (Products) page
    await expect(page.getByText("Products")).toBeVisible(); // Not a great locator as "Products" could appear anywhere in the test - maybe URL would be better.
    // When I click "Add to cart" on a product
    const testAllTheThingsShirtRed = page
      .getByText("Test.allTheThings() T-Shirt (Red)")
      .locator("..")
      .locator("..")
      .locator("..");
    await testAllTheThingsShirtRed
      .getByRole("button", { name: "Add to cart" })
      .click();
    // Then that products "Add to cart" button should change to "Remove"
    await expect(
      testAllTheThingsShirtRed.getByRole("button", { name: "Remove" })
    ).toBeVisible();
    // And the cart icon should show 1 item
    const cartIcon = page.locator("[data-test='shopping-cart-link']");
    // await expect(await cartIcon.innerText()).toBe("1"); // We can do better here
    await expect(cartIcon).toHaveText("1");
  });

  test("Remove Product from cart", async ({ page }) => {
    // Scenario: Remove a product from the cart and verify it disappears from the cart icon
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    // And I have added a product to the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // When I click "Remove" on a product
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    // Then that products "Remove" button should change to "Add to cart"
    await expect(
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    ).toBeVisible();
    // And the cart icon should show 0 items
    await expect(page.locator("[data-test='shopping-cart-link']")).toBeEmpty();
  });

  test("Check default product sort order", async ({ page }) => {
    // Scenario: Verify the default product sort order is "Name (A to Z)"
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    // When I check the current sort option
    // Then the sort option should be "Name (A to Z)"
    const sortOption = page.locator('[data-test="product-sort-container"]');
    await expect(sortOption).toHaveValue("az");

    // And the products should be sorted alphabetically
    // Get the product names as they current are
    const productNames = await page
      .locator(".inventory_item_name")
      .allTextContents();

    // Sort the product names alphabetically for comparison using sort method
    const sortedProductNames = [...productNames].sort(); //default behavior of sort is to sort strings alphabetically

    // Compare the original product names with the sorted ones
    await expect(productNames).toEqual(sortedProductNames);
    // console.log(
    //   "Product names are sorted alphabetically:",
    //   productNames,
    //   sortedProductNames
    // );
  });

  test("Sort products alphanumerically reverse (z-a)", async ({ page }) => {
    // Scenario: Sort products alphabetically in reverse order (Z to A)"
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");

    // Get the product names as they current are for comparison
    let productNames = await page
      .locator(".inventory_item_name")
      .allTextContents();

    // Sort the product names alphabetically reversed for comparison using sort method
    const sortedProductNames = [...productNames].reverse();

    // When I select the "Name (Z to A)" sort option
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("za");
    // Then the sort option should be "Name (Z to A)"
    await expect(
      page.locator('[data-test="product-sort-container"]')
    ).toHaveValue("za");

    // And the products should be sorted alphabetically in reverse order
    await expect(
      await page.locator(".inventory_item_name").allTextContents()
    ).toEqual(sortedProductNames);
  });

  test("Sort Products by price low to high", async ({ page }) => {
    // Scenario: Sort products by price from low to high
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    // When I select "Price (low to high)" from the sort dropdown
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("lohi");
    // Then the products should be sorted by price in ascending order
    // Get the prices of the products and verify they are in ascending order
    const prices = await page
      .locator(".inventory_item_price")
      .allTextContents();
    const numericPrices = prices.map((price) => {
      // Convert the prices to a number, removing the dollar sign
      return parseFloat(price.replace("$", ""));
    });

    // Ensure we have product prices to compare
    await expect(numericPrices.length).toBeGreaterThan(0);

    // Assert each price is greater than or equal to the previous one
    // Start with the second price and compare it to the first until the last
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
  });

  test("Sort Products by price high to low", async ({ page }) => {
    // Scenario: Sort products by price from high to low
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    // When I select "Price (high to low)" from the sort dropdown
    await page
      .locator('[data-test="product-sort-container"]')
      .selectOption("hilo");
    // Then the products should be sorted by price in descending order
    // Get the prices of the products and verify the order
    const prices = await page
      .locator(".inventory_item_price")
      .allTextContents();
    const numericPrices = prices.map((price) => {
      // Convert the prices to a number, removing the dollar sign
      return parseFloat(price.replace("$", ""));
    });

    // Ensure we have product prices to compare
    await expect(numericPrices.length).toBeGreaterThan(0);

    // Assert each price is greater than or equal to the previous one
    // Start with the second price and compare it to the first until the last
    for (let i = 1; i < numericPrices.length; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i - 1]);
    }
  });
});

test.describe("Product Details", () => {
  test("Verify product details", async ({ page }) => {
    // Scenario: Verify product details when clicking on a product
    // Given I am on the inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
    // When I click on a product
    await page.getByText("Sauce Labs Backpack").click(); // Could select the first product if we're not sure which products to expect or we could use mock data if this was something we could control
    // Then I should see the product details page with correct information
    await expect(page.locator(".inventory_details_name")).toHaveText(
      "Sauce Labs Backpack"
    );
    await expect(page.locator(".inventory_details_desc")).toContainText(
      "carry.allTheThings()"
    );
    await expect(page.locator(".inventory_details_price")).toHaveText("$29.99");
  });

  test("Check we can get back to the inventory page from a product", async ({
    page,
  }) => {
    // Scenario: Verify we can navigate back to the inventory page from a product
    // Given I am on a product details page
    await selectProduct(page);

    // When I click the "Back to products" link
    await page.locator('[data-test="back-to-products"]').click();

    // Then I should be taken to the product inventory page
    await expect(page.locator('[data-test="title"]')).toHaveText("Products");
  });

  test("Add product to cart from product details page", async ({ page }) => {
    // Scenario: Add a product to the cart from the product details page
    // Given I am on a product details page
    await selectProduct(page);
    // When I click the "Add to cart" button
    await page.getByRole("button", { name: "Add to cart" }).click();
    // Then the product should be added to the cart
    // (cart icon should show 1 item)
    await expect(page.locator("[data-test='shopping-cart-link']")).toHaveText(
      "1"
    );
    // And the "Add to cart" button should change to "Remove"
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
  });

  test("Remove product from cart from product details page", async ({
    page,
  }) => {
    // Scenario: Remove a product from the cart from the product details page
    // Given I am on a product details page
    await selectProduct(page);
    // And I have added a product to the cart
    await page.getByRole("button", { name: "Add to cart" }).click();
    // When I click the "Remove" button
    await page.getByRole("button", { name: "Remove" }).click();
    // Then the product should be added to the cart
    // (cart icon should show 1 item)
    await expect(page.locator("[data-test='shopping-cart-link']")).toBeEmpty();
    // And the "Add to cart" button should change to "Add to cart"
    await expect(
      page.getByRole("button", { name: "Add to cart" })
    ).toBeVisible();
  });
});
