import { Locator, Page } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

/**
 * Page Object Model for Login page.
 */
export class LoginPage extends BasePage {
    // ==================== LOCATORS ====================

    private readonly emailTextbox: Locator;
    private readonly passwordTextbox: Locator;
    private readonly loginButton: Locator;

    // Additional locators (for completeness/future reuse)
    private readonly signInWithAppleIdButton: Locator;
    private readonly forgotYourPasswordLink: Locator;
    private readonly signUpLink: Locator;

    constructor(page: Page) {
        super(page);

        // Prefer role-based locators when possible
        // Note: email textbox is mapped with a disambiguating fallback
        this.emailTextbox = this.page
            .locator('input[name="email"], input[type="email"], [name="email"]')
            .first();

        this.passwordTextbox = this.page
            .locator('input[name="password"], input[type="password"]')
            .first();

        this.loginButton = this.page.getByText('Login', { exact: true });

        this.signInWithAppleIdButton = this.page.getByRole('button', { name: 'Signin with apple ID' });
        this.forgotYourPasswordLink = this.page.getByRole('link', { name: 'Forgot your password?' });
        this.signUpLink = this.page.getByRole('link', { name: 'Sign Up' });
    }

    // ==================== NAVIGATION ====================

    async goto(url: string): Promise<void> {
        this.logStep(`Go to login page: ${url}`);
        await this.navigateTo(url);
    }

    // ==================== ACTIONS ====================

    async enterEmail(email: string): Promise<void> {
        this.logStep(`Enter email/username`);
        await ActionUtils.fill(this.emailTextbox, email, { page: this.page });
    }

    async enterPassword(password: string): Promise<void> {
        this.logStep('Enter password');
        await ActionUtils.fill(this.passwordTextbox, password, { page: this.page });
    }

    async clickLogin(): Promise<void> {
        this.logStep('Click Login');
        await ActionUtils.click(this.loginButton, { page: this.page });
    }

    // ==================== EXTRA ACTIONS (FUTURE REUSE) ====================

    async clickSignInWithAppleId(): Promise<void> {
        this.logStep('Click Signin with apple ID');
        await ActionUtils.click(this.signInWithAppleIdButton, { page: this.page });
    }

    async clickForgotYourPassword(): Promise<void> {
        this.logStep('Click Forgot your password?');
        await ActionUtils.click(this.forgotYourPasswordLink, { page: this.page });
    }

    async clickSignUp(): Promise<void> {
        this.logStep('Click Sign Up');
        await ActionUtils.click(this.signUpLink, { page: this.page });
    }
}
