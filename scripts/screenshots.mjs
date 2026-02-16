import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'public/screenshots');

const BASE_URL = process.env.APP_URL || 'http://moot.test';

async function main() {
    console.log('Seeding database...');
    execSync('php artisan migrate:fresh --seed --force', { cwd: ROOT, stdio: 'inherit' });

    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();

    // Login
    console.log('Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('password');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        page.locator('[data-test="login-button"]').click(),
    ]);

    // Screenshot 1: New thread page
    console.log('Capturing new thread page...');
    await page.goto(`${BASE_URL}/moot`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/new-thread.png` });

    // Screenshot 2: Conversation view
    const threadLink = page.locator('aside a[href*="/moot/0"]').first();
    if (await threadLink.count()) {
        console.log('Capturing conversation view...');
        await threadLink.click();
        await page.waitForURL('**/moot/0**', { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);
        await page.screenshot({ path: `${OUT}/conversation.png` });
    }

    await browser.close();
    console.log(`Screenshots saved to ${OUT}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
