import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '@/pages/base.page';
import { ActionUtils } from '@/utils/action-utils';

/**
 * Page Object Model for Profile/User Details form.
 *
 * Models editable fields: first name, last name, phone number, company, email and Save action.
 */
export class ProfilePage extends BasePage {
    // ==================== LOCATORS ====================

    private readonly firstNameTextbox: Locator;
    private readonly lastNameTextbox: Locator;
    private readonly phoneNumberTextbox: Locator;
    private readonly companyTextbox: Locator;
    private readonly emailTextbox: Locator;
    private readonly saveButton: Locator;

    // Optional success indicators (best-effort; app-dependent)
    private readonly successToast: Locator;

    constructor(page: Page) {
        super(page);

        // Inputs: use tolerant CSS to support differing implementations.
        this.firstNameTextbox = this.page
            .locator('input[name="firstName"], input#firstName, input[placeholder*="First" i], input[aria-label*="First" i]')
            .first();

        this.lastNameTextbox = this.page
            .locator('input[name="lastName"], input#lastName, input[placeholder*="Last" i], input[aria-label*="Last" i]')
            .first();

        this.phoneNumberTextbox = this.page
            .locator(
                'input[name="phone"], input[name="phoneNumber"], input#phone, input[type="tel"], input[placeholder*="Phone" i], input[aria-label*="Phone" i]'
            )
            .first();

        this.companyTextbox = this.page
            .locator('input[name="company"], input#company, input[placeholder*="Company" i], input[aria-label*="Company" i]')
            .first();

        this.emailTextbox = this.page
            .locator('input[name="email"], input#email, input[type="email"], input[placeholder*="Email" i], input[aria-label*="Email" i]')
            .first();

        // Save button: prefer accessible role, then common fallbacks.
        this.saveButton = this.page
            .getByRole('button', { name: /^save$/i })
            .or(this.page.getByText('Save', { exact: true }))
            .or(this.page.locator('button[type="submit"], input[type="submit"], button:has-text("Save")'));

        // Common toast/snackbar patterns
        this.successToast = this.page.locator('[role="alert"], .toast, .toast-success, .snackbar, .alert-success');
    }

    // ==================== ACTIONS ====================

    async enterFirstName(firstName: string): Promise<void> {
        this.logStep('Enter first name');
        await ActionUtils.fill(this.firstNameTextbox, firstName, { page: this.page });
    }

    async enterLastName(lastName: string): Promise<void> {
        this.logStep('Enter last name');
        await ActionUtils.fill(this.lastNameTextbox, lastName, { page: this.page });
    }

    async enterPhoneNumber(phoneNumber: string): Promise<void> {
        this.logStep('Enter phone number');
        await ActionUtils.fill(this.phoneNumberTextbox, phoneNumber, { page: this.page });
    }

    async enterCompany(company: string): Promise<void> {
        this.logStep('Enter company');
        await ActionUtils.fill(this.companyTextbox, company, { page: this.page });
    }

    async enterEmail(email: string): Promise<void> {
        this.logStep('Enter email');
        await ActionUtils.fill(this.emailTextbox, email, { page: this.page });
    }

    async clickSave(): Promise<void> {
        this.logStep('Click Save');
        await ActionUtils.click(this.saveButton, { page: this.page });
    }

    // ==================== ASSERTIONS ====================

    /**
     * Best-effort assertion that Save succeeded.
     *
     * Implementation is intentionally tolerant: it will pass if either a success toast appears
     * or the URL changes after clicking save (common patterns for save/redirect).
     */
    async assertSaveSuccessful(options: { timeout?: number } = {}): Promise<void> {
        const timeout = options.timeout ?? 15000;
        this.logStep('Assert save is successful');

        const urlBefore = this.page.url();

        // Race: toast visible OR URL change.
        await Promise.race([
            (async () => {
                await expect(this.successToast.first()).toBeVisible({ timeout });
            })(),
            (async () => {
                await this.page.waitForURL(url => url.toString() !== urlBefore, { timeout });
            })(),
        ]);
    }
}
