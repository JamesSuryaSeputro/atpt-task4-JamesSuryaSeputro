import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';
import { generateUserData, generatePaymentData, UserData } from '../utils/data-helper';
import * as fs from 'fs';

test.describe('End-to-End Purchase Flow', () => {
    let userData: UserData;
    let homePage: HomePage;

    // Generate unique user data for each test run
    test.beforeEach(async ({ page }) => {
        userData = generateUserData();
        homePage = new HomePage(page);
    });

    // Clean up by deleting the account after the test
    test.afterEach(async ({ page }) => {
        // Ensure we are logged in before trying to delete
        if (await homePage.loggedInAsText.isVisible()) {
            await homePage.deleteAccount();
            await expect(page.locator('a[href="/login"]')).toBeVisible(); // Verify logged out
        }
    });

    test('should allow a user to register, purchase 3 products, and download the invoice', async ({ page }) => {
        const signupPage = new SignupPage(page);
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const paymentPage = new PaymentPage(page);
        const paymentData = generatePaymentData();
        const productsToBuy = 3;

        // 1a. Visit home
        await homePage.goto();

        // 1b. Go to the Products page then add 3 items to the cart.
        await homePage.navigateToProducts();
        await productsPage.addProductsToCart(productsToBuy);
        await homePage.navigateToCart();
        await cartPage.verifyCartItemCount(productsToBuy);

        // 1c. Register a new account after adding to cart
        await homePage.navigateToLogin();
        await signupPage.startSignup(userData.name, userData.email);
        await signupPage.fillRegistrationForm(userData);
        await signupPage.proceedFromAccountCreated();
        await expect(homePage.loggedInAsText).toContainText(userData.name);

        // 1d. Return to Cart and proceed
        await homePage.navigateToCart();
        await cartPage.verifyCartItemCount(productsToBuy);
        const cartTotal = await cartPage.getCartTotalPrice();
        await cartPage.proceedToCheckout();
        await checkoutPage.verifyCheckoutTotalPrice(cartTotal);


        // 1e. Continue until the transaction is successful.
        await checkoutPage.placeOrder();
        await paymentPage.fillPaymentDetails(paymentData);
        await paymentPage.confirmOrder();
        await paymentPage.verifyOrderSuccess();

        // 1f. Download the invoice and save it in the download folder.
        const invoicePath = await paymentPage.downloadInvoice();
        expect(fs.existsSync(invoicePath)).toBeTruthy();
        console.log(`Invoice downloaded to: ${invoicePath}`);

        // 1g. Continue until you return to the home page.
        await homePage.continueButton.click();
        await expect(page).toHaveURL('https://automationexercise.com/');
    });
});