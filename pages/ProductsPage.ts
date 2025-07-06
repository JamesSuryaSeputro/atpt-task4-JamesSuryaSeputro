import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productList: Locator;
  readonly continueShoppingButton: Locator;
  readonly viewCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('.product-image-wrapper');
    this.continueShoppingButton = page.locator('.modal-footer .btn');
    this.viewCartButton = page.getByRole('link', { name: 'Cart' });

  }

  async addProductsToCart(count: number) {
    const products = await this.productList.all();
    for (let i = 0; i < count; i++) {
      await products[i].scrollIntoViewIfNeeded();
      await products[i].hover();
      await products[i].locator('.overlay-content a.add-to-cart').click();
      await this.continueShoppingButton.click();
    }
  }
}