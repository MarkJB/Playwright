import { test, expect } from "@playwright/test";
import { login } from "../utils/utils";

test.describe("Navigation Menu", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto("https://www.saucedemo.com/");
    // Login with default credentials
    await login(page);
  });

  // Verify navigation menu items
  // There are probably better ways to verify the navigation than
  // start and end location URLs, but this is a start.
  // Would prefer to use user facing indicators like the page title,
  const menuItems = [
    {
      text: "All Items",
      dataTestId: "inventory-sidebar-link",
      startLocation: "https://www.saucedemo.com/inventory-item.html?id=4",
      endLocation: "https://www.saucedemo.com/inventory.html",
    },
    {
      text: "About",
      dataTestId: "about-sidebar-link",
      startLocation: "https://www.saucedemo.com/inventory.html",
      endLocation: "https://saucelabs.com",
    },
    {
      text: "Logout",
      dataTestId: "logout-sidebar-link",
      startLocation: "https://www.saucedemo.com/inventory.html",
      endLocation: "https://www.saucedemo.com/",
    },
    {
      text: "Reset App State",
      dataTestId: "reset-sidebar-link",
      startLocation: "https://www.saucedemo.com/inventory.html",
      endLocation: "https://www.saucedemo.com/inventory.html",
    },
  ];

  // I went down a rabbit hole here because I started writing a test and then decided
  // that it would be better as a parameterized test. So within the test block, I wrote
  // the test data, then created a forEach loop to iterate over the menu items.
  // However, that didn't work because the forEach loop does not wait for the async function.
  // took some debugging to figure this out... I think I've tripped up on this before...
  // forEach is not awaited, so we need to use a for loop or map with Promise.all
  // menuItems.forEach(async (item) => {   // This did not work inside the test.
  // menuItems.map(async (item) => {  // This didn't work on its own, Would have to wait for all promises.
  // for (const item of menuItems) {  // This did work, but took some figuring out.

  // tl;dr: avoid async in the forEach loop, just pass the 'item' to the test function (the test function is async)
  // Async in the forEach loop might only be potentially problematic, but best to avoid.

  menuItems.forEach((item) => {
    test(`Verify navigation menu item: ${item.text}`, async ({ page }) => {
      // Verify that we are on the inventory page
      await expect(page.locator('[data-test="title"]')).toHaveText("Products");

      // Go to the start location of the menu item
      await page.goto(item.startLocation);

      // Click on the menu item to open the sidebar
      await page.getByRole("button", { name: "Open Menu" }).click();

      // Verify the menu item is visible and has the correct text
      const locator = page.locator(`[data-test="${item.dataTestId}"]`);
      await expect(locator).toBeVisible();
      await expect(locator).toHaveText(item.text);

      // Click the menu item to navigate
      await locator.click();

      // "All Items" will navigate to "Products" if we are not already on the Product page.
      // "Reset App State" will reset the cart to empty but doesn't navigate anywhere.
      // "Logout" will take us back to the login page.
      // "About" will navigate to the about page.
      //   const closeMenuButton = page.getByRole("button", { name: "Close Menu" });
      //   if (await closeMenuButton.isVisible()) {
      //     await closeMenuButton.click();
      //   }

      // Verify that we are on the end location of the menu item
      await expect(page).toHaveURL(item.endLocation);
    });
  });
});
