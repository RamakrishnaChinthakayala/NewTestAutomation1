import { test, expect } from '@test-setup/fixtures';
import { LoginPage } from '@/pages/login.page';
import { ProfilePage } from '@/pages/profile.page';
import { TestDataUtils } from '@/utils/test-data-utils';

test.describe('Login and Save Profile', () => {
    test('test_login_fill_profile_and_save', async ({ page }) => {
        const loginPage = new LoginPage(page);

        const validLogin = TestDataUtils.getTestData('validLogin') as { email: string; password: string };
        const validProfile = TestDataUtils.getTestData('validProfile') as {
            firstName: string;
            lastName: string;
            phone: string;
            company: string;
            email: string;
        };

        // (2) Navigate to login
        await loginPage.goto('/login');
        await expect(page).toHaveURL(/\/login/i);

        // (3) Enter credentials
        await loginPage.enterEmail(validLogin.email);
        await loginPage.enterPassword(validLogin.password);

        // (4) Click Login and wait for app to settle
        await Promise.all([page.waitForLoadState('networkidle'), loginPage.clickLogin()]);

        // (5) Instantiate ProfilePage
        const profilePage = new ProfilePage(page);

        // Best-effort assertion we are not on login anymore
        await expect(page).not.toHaveURL(/\/login/i);

        // (6) Fill profile fields
        await profilePage.enterFirstName(validProfile.firstName);
        await profilePage.enterLastName(validProfile.lastName);
        await profilePage.enterPhoneNumber(validProfile.phone);
        await profilePage.enterCompany(validProfile.company);
        await profilePage.enterEmail(validProfile.email);

        // (7) Click Save
        await Promise.all([page.waitForLoadState('networkidle'), profilePage.clickSave()]);

        // (8) Assert expected result
        await profilePage.assertSaveSuccessful({ timeout: 15000 });
        await expect(page).not.toHaveURL(/\/login/i);
    });
});
