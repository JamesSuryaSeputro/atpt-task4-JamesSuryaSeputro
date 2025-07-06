import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly signupLoginButton: Locator;
    readonly sliderCarousel: Locator;
    readonly loginLink: Locator;
    readonly productsLink: Locator; // Addition
    readonly deleteAccountLink: Locator; // Addition
    readonly loggedInAsText: Locator;
    readonly continueButton: Locator;
    readonly cartLink: Locator;


    constructor(page: Page) {
        super(page);
        this.signupLoginButton = page.locator('a[href="/login"]');
        this.sliderCarousel = page.locator('#slider-carousel');
        this.loginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.productsLink = page.locator('a[href="/products"]');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
        this.loggedInAsText = page.locator('li:has-text("Logged in as")');
        this.continueButton = page.locator('[data-qa="continue-button"]');
        this.cartLink = page.getByRole('link', { name: /Cart$/, exact: false });
    }

    async navigateToLogin() {
        await this.loginLink.scrollIntoViewIfNeeded();
        await this.loginLink.click();
    }

    // Addition
    async navigateToProducts() {
        await this.productsLink.click();
    }

    // Addition
    async deleteAccount() {
        await this.deleteAccountLink.click();
        await this.continueButton.click();
    }

    //Addition
    async navigateToCart() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.cartLink.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(500);

        await this.cartLink.click();
        await this.page.waitForURL('**/view_cart');
    }
}