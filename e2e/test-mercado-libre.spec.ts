import { test, expect, type Page, type Locator } from "@playwright/test";

// Constants
const SELECTORS = {
  SEARCH_BOX: 'combobox[name="Ingresa lo que quieras"]',
  SEARCH_BUTTON: 'button[name="Buscar"]',
  NEW_ITEM_FILTER:
    "#root-app > div > div.ui-search-main.ui-search-main--only-products.ui-search-main--with-topkeywords > aside > section.ui-search-filter-groups > div:nth-child(5) > ul > li:nth-child(1) > a",
  SORT_BUTTON: 'button[name="Más relevantes"]',
  PRODUCT_TITLES: [
    ".ui-search-item__title",
    ".poly-component__title",
    '[data-testid="item-title"]',
    ".ui-search-item__group__element h2 a",
  ],
  PRODUCT_PRICES: [
    ".andes-money-amount__fraction",
    ".price-tag-fraction",
    ".ui-search-price__part",
    '[data-testid="price"] .andes-money-amount__fraction',
  ],
} as const;

const TEXTS = {
  SEARCH_TERM: "Playstation 5",
  COUNTRY: "México",
  SORTED_BY: "Menor precio",
  // Popup buttons - used for cleaning the screen for screenshots
  LATER_BUTTON: "Más tarde",
  COOKIES: "Aceptar cookies",
} as const;

// Types
interface Product {
  title: string;
  price: string;
}

// Helper functions

// Initial setup: visit Mexico site and handle popups
async function visitMexicoSite(page: Page): Promise<void> {
  // Visit the landing page
  await page.goto("https://www.mercadolibre.com/");
  await page.screenshot({
    path: "screenshots/1-landing-page.png",
    fullPage: false,
  });

  // Select México as a country
  await page.getByRole("link", { name: TEXTS.COUNTRY }).click();

  // Clean the screen for screenshots by closing popups if they appear
  // If the popups do not appear, the test continues without issues
  await Promise.allSettled([
    page
      .getByRole("button", { name: TEXTS.LATER_BUTTON })
      .click({ timeout: 3000 }),
    page.getByRole("button", { name: TEXTS.COOKIES }).click({ timeout: 3000 }),
  ]);
  await page.screenshot({
    path: "screenshots/2-mexico-landing-page.png",
    fullPage: false,
  });
}

// Search for a product using the search box
async function searchProduct(page: Page, searchTerm: string): Promise<void> {
  const searchBox = page.getByRole("combobox", {
    name: "Ingresa lo que quieras",
  });

  await searchBox.click();
  await searchBox.fill(searchTerm);
  await page.screenshot({
    path: "screenshots/3-playstation-search.png",
    fullPage: false,
  });

  await page.getByRole("button", { name: "Buscar" }).click();
}

// Apply filters and sort results
async function applyFiltersAndSort(page: Page): Promise<void> {
  // Apply "Nuevos" filter
  const newItemFilter = page.locator(SELECTORS.NEW_ITEM_FILTER);
  await newItemFilter.scrollIntoViewIfNeeded();
  await expect(newItemFilter).toBeVisible();
  await page.screenshot({
    path: "screenshots/4-results-without-filter.png",
    fullPage: false,
  });

  await newItemFilter.click();
  await page.screenshot({
    path: "screenshots/5-results-with-new-filter.png",
    fullPage: true,
  });

  // Sort by lowest price
  await page.getByRole("button", { name: "Más relevantes" }).click();
  await page.screenshot({
    path: "screenshots/6-sort-options.png",
    fullPage: false,
  });

  await page.getByText(TEXTS.SORTED_BY).click();
  await page.screenshot({
    path: "screenshots/7-results-sorted-by-price.png",
    fullPage: false,
  });
}

// Function to find the first available locator from a list of selectors
async function findFirstAvailableElement(
  page: Page,
  selectors: readonly string[]
): Promise<Locator | null> {
  // Iterate through the selectors and return the first one that matches
  for (const selector of selectors) {
    const locator = page.locator(selector);
    const count = await locator.count();
    if (count > 0) return locator;
  }
  // If none match
  return null;
}

// Extract product titles and prices, returning an array of Product objects using the Product interface
async function extractProductData(
  page: Page,
  maxProducts: number = 5
): Promise<Product[]> {
  // Search for titles and prices
  const titleLocator = await findFirstAvailableElement(
    page,
    SELECTORS.PRODUCT_TITLES
  );
  const priceLocator = await findFirstAvailableElement(
    page,
    SELECTORS.PRODUCT_PRICES
  );

  // If no titles found, return empty array
  if (!titleLocator || (await titleLocator.count()) === 0) {
    console.log("No product titles found - check for changes in selectors");
    return [];
  }

  const titleCount = await titleLocator.count();
  // Price is an optional value in Mercado Libre
  const priceCount = priceLocator ? await priceLocator.count() : 0;

  // Optional log. Get the counts for the number of items found
  // console.log(`Found ${titleCount} product titles and ${priceCount} prices`);

  // Determine how many products are available to extract, up to maxProducts
  const numberOfProductsToExtract = Math.min(titleCount, maxProducts);

  // Using the Product interface
  const products: Product[] = [];

  // Extract data in parallel for better performance
  const getProductData = Array.from(
    { length: numberOfProductsToExtract },
    async (_, i) => {
      // Extract title
      const title = await titleLocator.nth(i).innerText();

      let price = "";
      // Extract price if available
      if (priceLocator && i < priceCount) {
        try {
          price = await priceLocator.nth(i).innerText();
        } catch (error) {
          // Leave price as empty string if extraction fails
          console.log(`Could not extract price for product ${i + 1}`);
          price = "No disponible";
        }
      }

      return {
        title: title.trim(),
        price: price.trim(),
      };
    }
  );

  // Await all promises in parallel for performance
  const productData = await Promise.all(getProductData);
  products.push(...productData);

  return products;
}

function logProducts(products: Product[]): void {
  if (products.length === 0) {
    console.log("No products found");
    return;
  }

  console.log("First 5 products with titles and prices:");
  products.forEach((product, i) => {
    console.log(`${i + 1}. ${product.title} - $${product.price}`);
  });
}

test("Playstation search and sort in Mercado Libre", async ({ page }) => {
  // Setup Mexico site and handle popups
  await visitMexicoSite(page);

  // Search for product
  await searchProduct(page, TEXTS.SEARCH_TERM);

  // Apply filters and sort results
  await applyFiltersAndSort(page);

  // Extract and log product data
  // Optionally you can pass maxProducts as second argument, default is 5
  const products = await extractProductData(page);
  logProducts(products);
});
