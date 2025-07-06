import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('.col-sm-6 .btn-default');
  }

  async verifyCartItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async getCartTotalPrice(): Promise<number> {
    let total = 0;
    const items = await this.cartItems.all();
    for (const item of items) {
      const priceText = await item.locator('.cart_price p').innerText();
      const quantityText = await item.locator('.cart_quantity button').innerText();
      const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);
      const quantity = parseInt(quantityText, 10);
      const itemTotal = price * quantity;

      console.log(`Item - Price: ${price}, Quantity: ${quantity}, Subtotal: ${itemTotal}`);
      total += itemTotal;
    }
    console.log(`Cart page total: ${total}`);
    return total;
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutButton.waitFor({ state: 'visible' });
    await this.proceedToCheckoutButton.scrollIntoViewIfNeeded();
    await this.proceedToCheckoutButton.click();
  }
}