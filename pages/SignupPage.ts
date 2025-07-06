import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/data-helper';

export class SignupPage extends BasePage {
    // Signup
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly signupButton: Locator;
    
    // Registration Form
    readonly titleRadio: (title: 'Mr' | 'Mrs') => Locator;
    readonly passwordInput: Locator;
    readonly dobDay: Locator;
    readonly dobMonth: Locator;
    readonly dobYear: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    // Account Created
    readonly accountCreatedHeader: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        super(page);
        this.nameInput = page.locator('[data-qa="signup-name"]');
        this.emailInput = page.locator('[data-qa="signup-email"]');
        this.signupButton = page.locator('[data-qa="signup-button"]');
        
        this.titleRadio = (title) => page.locator(title === 'Mr' ? '#id_gender1' : '#id_gender2');
        this.passwordInput = page.locator('[data-qa="password"]');
        this.dobDay = page.locator('[data-qa="days"]');
        this.dobMonth = page.locator('[data-qa="months"]');
        this.dobYear = page.locator('[data-qa="years"]');
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.addressInput = page.locator('[data-qa="address"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipcodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('[data-qa="create-account"]');
        this.accountCreatedHeader = page.locator('[data-qa="account-created"]');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async startSignup(name: string, email: string) {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.signupButton.click();
    }

    async fillRegistrationForm(userData: UserData) {
        await this.titleRadio(userData.title).check();
        await this.passwordInput.fill(userData.password);
        await this.dobDay.selectOption(userData.dob.day);
        await this.dobMonth.selectOption(userData.dob.month);
        await this.dobYear.selectOption(userData.dob.year);
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.addressInput.fill(userData.address);
        await this.countrySelect.selectOption(userData.country);
        await this.stateInput.fill(userData.state);
        await this.cityInput.fill(userData.city);
        await this.zipcodeInput.fill(userData.zipcode);
        await this.mobileNumberInput.fill(userData.mobileNumber);
        await this.createAccountButton.click();
    }

    async proceedFromAccountCreated() {
        await expect(this.accountCreatedHeader).toBeVisible();
        await this.continueButton.click();
    }
}