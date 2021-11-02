import { initializeBrowser } from "./setup.js";

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
