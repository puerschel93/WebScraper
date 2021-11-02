import fs from "fs";
import { initializeBrowser } from "./setup.js";

const URLS = [];
const MAX_NUMBER_OF_RESULTS = 1500;
const SEARCH_STRING = "LESS";

/**
 * Initializes the browser and performs login on codepen.io
 */
const initialize = async () => {
  const page = await initializeBrowser();

  setTimeout(async () => {
    const url = `https://codepen.io/search/pens?q=${SEARCH_STRING.toLocaleLowerCase()}`;
    await page.goto(url);
    setTimeout(() => {
      const xpath = '//*[@id="react-page"]/div[2]/div[2]/div/nav/button';
      scrapeURLS(page, xpath);
    }, 1000);
  }, 5000);
};

/**
 * The actual scrape algorithm to gather urls.
 * @param {*} page - Page initialized by puppeteer
 * @param {*} xpath - current Path for the Next-Button whether the Back-Button exists or not
 * @returns void
 */
const scrapeURLS = async (page, xpath) => {
  await page.waitForSelector(".ItemPreviewCover-module_root-3ZIH_");
  const arr = await page.$$(".ItemPreviewCover-module_root-3ZIH_");

  // Fallback when promise doesn't resolve
  const timeout = setTimeout(() => page.reload(), 3500);

  for (const el of arr) {
    var href = await el.getProperty("href");
    href = await href.jsonValue();
    URLS.push(href);
  }

  if (URLS.length > MAX_NUMBER_OF_RESULTS) {
    fs.writeFile(
      `./urls/${SEARCH_STRING.toLocaleLowerCase()}-urls.json`,
      JSON.stringify(URLS),
      (err, res) => console.error(err)
    );
    browser.close();
    return;
  }

  await page.waitForXPath(xpath);
  const next = await page.$x(xpath);

  next[0].click();
  clearTimeout(timeout);
  setTimeout(() => {
    const newpath = '//*[@id="react-page"]/div[2]/div[2]/div[2]/nav/button[2]';
    scrapeURLS(page, newpath);
  }, 1500);
};

initialize();
