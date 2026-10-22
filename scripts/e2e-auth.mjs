import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3100";
const stamp = Date.now();
let failures = 0;
const browser = await chromium.launch();

async function check(name, fn) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const jsErrors = [];
  page.on("pageerror", (e) => jsErrors.push(String(e)));
  try {
    const detail = await fn(page);
    const bad = (await page.content()).includes("__next_error__");
    console.log(`${!bad && jsErrors.length === 0 ? "PASS" : "FAIL"} ${name} :: ${detail}`);
    if (bad || jsErrors.length) failures++;
  } catch (err) {
    console.log(`FAIL ${name} :: ${String(err).slice(0, 200)}`);
    failures++;
  }
  await ctx.close();
}

// 1. existing accounts -> role dashboard
for (const acc of [
  { email: "admin@nganyahire.com", password: "admin123", expect: "/admin" },
  { email: "driver@nganyahire.com", password: "driver123", expect: "/driver" },
  { email: "owner@nganyahire.com", password: "owner123", expect: "/owner" },
]) {
  await check(`login ${acc.email}`, async (page) => {
    await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
    await page.fill("#email", acc.email);
    await page.fill("#password", acc.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`**${acc.expect}`, { timeout: 25000 });
    return page.url().replace(BASE, "");
  });
}

// 2. wrong password shows inline error and stays put
await check("wrong password", async (page) => {
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded" });
  await page.fill("#email", "admin@nganyahire.com");
  await page.fill("#password", "definitely-wrong");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(6000);
  const text = await page.innerText("body");
  const stayed = page.url().includes("/login");
  const showedError = text.includes("Invalid email or password");
  if (!stayed || !showedError) throw new Error(`stayed=${stayed} error=${showedError}`);
  return "inline error shown, stayed on /login";
});

// 3. customer self-registration -> dashboard
await check("customer signup", async (page) => {
  await page.goto(`${BASE}/register`, { waitUntil: "domcontentloaded" });
  await page.fill("#name", "E2E Customer");
  await page.fill("#email", `e2e-customer-${stamp}@example.com`);
  await page.fill("#password", "testpass123");
  await page.fill("#confirmPassword", "testpass123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 25000 });
  await page.getByText("Karibu").first().waitFor({ timeout: 20000 });
  return "signed up and landed on /dashboard";
});

// 4. driver application -> driver portal with pending status
await check("driver signup", async (page) => {
  await page.goto(`${BASE}/driver/register`, { waitUntil: "domcontentloaded" });
  await page.fill("#firstName", "E2E");
  await page.fill("#lastName", "Driver");
  await page.fill("#phone", "+254700111222");
  await page.fill("#licenseNumber", "DL-E2E12345");
  await page.fill("#email", `e2e-driver-${stamp}@example.com`);
  await page.fill("#password", "testpass123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/driver", { timeout: 25000 });
  await page.getByText("PENDING").first().waitFor({ timeout: 20000 });
  return "applied and landed on /driver (PENDING)";
});

// 5. owner signup -> owner portal
await check("owner signup", async (page) => {
  await page.goto(`${BASE}/owner/register`, { waitUntil: "domcontentloaded" });
  await page.fill("#businessName", "E2E Fleet");
  await page.fill("#name", "E2E Owner");
  await page.fill("#email", `e2e-owner-${stamp}@example.com`);
  await page.fill("#password", "testpass123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/owner", { timeout: 25000 });
  return "registered and landed on /owner";
});

await browser.close();
console.log(failures === 0 ? "ALL PASS" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
