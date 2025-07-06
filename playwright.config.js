// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "./tests",
  timeout: 90 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    video: "off",
    screenshot: "off",
    baseURL: "https://rahulshettyacademy.com/seleniumPractise/#/",
  },
  retries: 0,
  reporter: [["list", { printOnlyOnFailure: false }]], 
};

export default config;
