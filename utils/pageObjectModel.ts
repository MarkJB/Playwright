import { Page, Locator } from "@playwright/test";

export class PageObjectModel {
  private page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  common = {
    title: () => this.page.locator('[data-test="title"]'),
    shoppingCartIconButton: () =>
      this.page.locator('[data-test="shopping-cart-link"]'),
  };

  login = {
    title: this.common.title,
    usernameInput: () => this.page.getByRole("textbox", { name: "Username" }),
    passwordInput: () => this.page.getByRole("textbox", { name: "Password" }),
    loginButton: () => this.page.getByRole("button", { name: "Login" }),
    errorMessage: (text: string) => this.page.getByText(text),
  };

  inventory = {
    title: this.common.title,
    shoppingCartIconButton: this.common.shoppingCartIconButton,
    productSortDropdown: () =>
      this.page.locator('[data-test="product-sort-container"]'),
    productNameList: () => this.page.locator(".inventory_item_name"),
    productPriceList: () => this.page.locator(".inventory_item_price"),
    addToCartButton: (productId: string) =>
      this.page.locator(`[data-test="add-to-cart-${productId}"]`),
    removeFromCartButton: (productId: string) =>
      this.page.locator(`[data-test="remove-${productId}"]`),
    productByName: (name: string) => this.page.getByText(name),
  };

  inventoryItem = {
    title: this.common.title,
    shoppingCartIconButton: this.common.shoppingCartIconButton,
    // Product details
    addToCartButton: () =>
      this.page.getByRole("button", { name: "Add to cart" }),
    removeFromCartButton: () =>
      this.page.getByRole("button", { name: "Remove" }),
    name: () => this.page.locator(".inventory_details_name"),
    description: () => this.page.locator(".inventory_details_desc"),
    price: () => this.page.locator(".inventory_details_price"),
    backToProductsButton: () =>
      this.page.locator('[data-test="back-to-products"]'),
  };

  cart = {
    title: this.common.title,
    shoppingCartLink: () =>
      this.page.locator('[data-test="shopping-cart-link"]'),
    checkoutButton: () => this.page.getByRole("button", { name: "Checkout" }),
    // Checkout form
    firstNameInput: () =>
      this.page.getByRole("textbox", { name: "First Name" }),
    lastNameInput: () => this.page.getByRole("textbox", { name: "Last Name" }),
    postalCodeInput: () =>
      this.page.getByRole("textbox", { name: "ZIP/Postal Code" }),
    continueButton: () => this.page.getByRole("button", { name: "Continue" }),
    overviewTitle: () => this.page.locator('[data-test="title"]'),
    finishButton: () => this.page.getByRole("button", { name: "Finish" }),
    completeHeader: () => this.page.locator('[data-test="complete-header"]'),
    completeText: () => this.page.locator('[data-test="complete-text"]'),
    errorMessage: (text: string) => this.page.getByText(text),
  };

  navigation = {
    openMenuButton: () => this.page.getByRole("button", { name: "Open Menu" }),
    closeMenuButton: () =>
      this.page.getByRole("button", { name: "Close Menu" }),
    menuItem: (dataTestId: string) =>
      this.page.locator(`[data-test="${dataTestId}"]`),
    // Menu items
    allItems: () => this.page.locator('[data-test="inventory-sidebar-link"]'),
    about: () => this.page.locator('[data-test="about-sidebar-link"]'),
    logout: () => this.page.locator('[data-test="logout-sidebar-link"]'),
    resetAppState: () => this.page.locator('[data-test="reset-sidebar-link"]'),
  };
}
