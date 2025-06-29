import { test, expect } from "@playwright/test";
import { login } from "../utils/utils";

test.use({ trace: "on" });

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

  // tl;dr: avoid async in the forEach loop, just pass the 'item' directly to the test function in a syncronous way.
  // the function passed to `test()` can be async. e.g. `[].forEach((item) => { test(`test name: ${item.text}`, async ({ page }) => { }); });`

  menuItems.forEach((item) => {
    test(`Verify navigation menu item: ${item.text}`, async ({ page }) => {
      // Verify that we are on the inventory page
      await expect(page.locator('[data-test="title"]')).toHaveText("Products");

      console.log("Before page.goto", await page.url());
      // Go to the start location of the menu item only if it is not already the current page.
      if (page.url() !== item.startLocation) {
        await page.goto(item.startLocation);
      } else {
        console.log("Don't navigate");
      }
      console.log("After page.goto", await page.url());

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
