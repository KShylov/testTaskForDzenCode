import { test, expect } from "@playwright/test";

// === Global Selectors ===
const url = "https://rahulshettyacademy.com/seleniumPractise/#/";
const searchInput = '//input[contains(@class, "search-keyword")]';
const productBlock = (name) =>
  `//div[@class="product" and .//*[contains(text(), '${name}')]]`;
const quantityInput = "input.quantity";
const incrementButton = ".increment";
const addToCartButton = 'button:has-text("ADD TO CART")';
const itemsCountLocator = '//tr[td[contains(text(), "Items")]]/td/strong';
const cartIcon = ".cart-icon";
const cartItemsList = '//ul[@class="cart-items"]';
const removeProductByName = (name) =>
  `//li[.//p[contains(text(), "${name}")]]//a[@class="product-remove"]`;

// === Utility for logging step results ===
async function logStep(title, fn) {
  const info = test.info();
  const errorCountBefore = info.errors.length;

  await fn();

  const errorCountAfter = test.info().errors.length;
  const newErrors = errorCountAfter - errorCountBefore;

  if (newErrors > 0) {
    console.error(`❌ ${title} — ${newErrors} soft assertion error(s)`);
    test
      .info()
      .errors.slice(errorCountBefore)
      .forEach((err, i) =>
        console.error(`   ${i + 1}) ${err.message.replace(/\n.*/s, "")}`)
      );
  } else {
    console.log(`✅ ${title}`);
  }
}

// === Main Test ===
test("Cart flow", async ({ page }) => {
  await test.step("Step 1: Go to site", async () =>
    logStep("Open website", async () => {
      await page.goto(url);
      await expect(page).toHaveURL(url);
    }));

  await test.step('Step 2: Search for "ro"', async () =>
    logStep('Search "ro"', async () => {
      await page.locator(searchInput).fill("ro");
      const count = await page.locator('//div[@class="product"]').count();
      expect(count).toBe(4);
    }));

  await test.step("Step 3: Set Carrot quantity to 5", async () =>
    logStep("Fill Carrot quantity", async () => {
      const carrot = page.locator(productBlock("Carrot"));
      await carrot.locator(quantityInput).fill("5");
      await expect.soft(carrot.locator(quantityInput)).toHaveValue("5");
    }));

  await test.step("Step 4: Increment Mushroom quantity to 3", async () =>
    logStep("Increment Mushroom quantity", async () => {
      const mushroom = page.locator(productBlock("Mushroom"));
      await mushroom.locator(incrementButton).click({ clickCount: 2 });
      await expect.soft(mushroom.locator(quantityInput)).toHaveValue("3");
    }));

  await test.step("Step 5: Add Carrot to cart", async () =>
    logStep("Add Carrot", async () => {
      const carrot = page.locator(productBlock("Carrot"));
      await carrot.locator(addToCartButton).click();
      await expect.soft(page.locator(itemsCountLocator)).toHaveText("1");
    }));

  await test.step("Step 6: Add Mushroom to cart", async () =>
    logStep("Add Mushroom", async () => {
      const mushroom = page.locator(productBlock("Mushroom"));
      await mushroom.locator(addToCartButton).click();
      await expect.soft(page.locator(itemsCountLocator)).toHaveText("2");
    }));

  await test.step("Step 7: Open cart and check items", async () =>
    logStep("Verify cart contents", async () => {
      await page.locator(cartIcon).click();
      const cartList = page.locator(cartItemsList).first();
      await expect
        .soft(cartList)
        .toHaveText("Carrot - 1 Kg565 Nos. 280×Mushroom - 1 Kg753 Nos. 225×");
    }));

  await test.step("Step 8: Remove Carrot from cart", async () =>
    logStep("Remove Carrot", async () => {
      await page.locator(removeProductByName("Carrot")).first().click();
      const cartList = page.locator(cartItemsList).first();
      await expect.soft(cartList).toHaveText("Mushroom - 1 Kg753 Nos. 225×");
    }));
});
