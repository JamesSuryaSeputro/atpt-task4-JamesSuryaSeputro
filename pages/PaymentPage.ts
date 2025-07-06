import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentData } from '../utils/data-helper';
import * as path from 'path';

export class PaymentPage extends BasePage {
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payAndConfirmButton: Locator;
    readonly successMessage: Locator;
    readonly downloadInvoiceButton: Locator;

    constructor(page: Page) {
        super(page);
        this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
        this.cardNumberInput = page.locator('[data-qa="card-number"]');
        this.cvcInput = page.locator('[data-qa="cvc"]');
        this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
        this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
        this.payAndConfirmButton = page.locator('[data-qa="pay-button"]');
        this.successMessage = page.locator('p:has-text("Congratulations! Your order has been confirmed!")');
        this.downloadInvoiceButton = page.locator('a.check_out');
    }

    async fillPaymentDetails(paymentData: PaymentData) {
        await this.nameOnCardInput.fill(paymentData.cardName);
        await this.cardNumberInput.fill(paymentData.cardNumber);
        await this.cvcInput.fill(paymentData.cvc);
        await this.expiryMonthInput.fill(paymentData.expiryMonth);
        await this.expiryYearInput.fill(paymentData.expiryYear);
    }

    async confirmOrder() {
        await this.payAndConfirmButton.click();
    }

    async verifyOrderSuccess() {
        await expect(this.successMessage).toBeVisible();
    }
    
    async downloadInvoice(): Promise<string> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.downloadInvoiceButton.click();
        const download = await downloadPromise;
        
        const downloadPath = path.join(`invoice-${Date.now()}.txt`);
        await download.saveAs(downloadPath);
        return downloadPath;
    }
}