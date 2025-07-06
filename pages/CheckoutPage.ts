import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
    readonly totalAmount: Locator;
    readonly commentBox: Locator;
    readonly placeOrderButton: Locator;

    constructor(page: Page) {
        super(page);
        this.totalAmount = page.locator('.cart_total_price');
        this.commentBox = page.locator('textarea[name="message"]');
        this.placeOrderButton = page.locator('a[href="/payment"]');
    }

    async verifyCheckoutTotalPrice(expectedTotal: number) {
        const totalText = await this.totalAmount.last().textContent();
        const actualTotal = parseInt(totalText?.replace('Rs. ', '').trim() || '0', 10);

        console.log(`Expected: ${expectedTotal}, Found: ${actualTotal}`);
        expect(actualTotal).toBe(expectedTotal);
    }

    async placeOrder(comment: string = 'Automated test order') {
        await this.commentBox.fill(comment);
        await this.placeOrderButton.click();
    }
}