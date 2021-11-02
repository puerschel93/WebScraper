const puppeteer = require("puppeteer-extra");
const fs = require("fs");

const urls = [];

const scrape = async (page, xpath) => {
  await page.waitForSelector(".ItemPreviewCover-module_root-3ZIH_");
  const arr = await page.$$(".ItemPreviewCover-module_root-3ZIH_");

  for (const el of arr) {
    var href = await el.getProperty("href");
    href = await href.jsonValue();
    urls.push(href);
  }
  console.log(urls.length);
  if (urls.length > 1500) {
    fs.writeFile("./urls/less-urls.txt", JSON.stringify(urls), (err, res) =>
      console.error(err)
    );
    return;
    browser.close();
  }

  await page.waitForXPath(xpath);
  const next = await page.$x(xpath);

  next[0].click();
  setTimeout(() => {
    const newpath = '//*[@id="react-page"]/div[2]/div[2]/div[2]/nav/button[2]';
    scrape(page, newpath);
  }, 1500);
};

const initialize = async () => {
  const loginurl = "https://codepen.io/login";
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(loginurl);
  await page.waitForSelector("#login-email-field");
  await page.waitForSelector("#login-password-field");
  await page.type("#login-email-field", "puerschel93");
  await page.type("#login-password-field", "office133737");
  await page.click("#log-in-button");
  setTimeout(async () => {
    const url = "https://codepen.io/search/pens?q=less";
    await page.goto(url);
    setTimeout(() => {
      const xpath = '//*[@id="react-page"]/div[2]/div[2]/div/nav/button';
      scrape(page, xpath);
    }, 1000);
  }, 5000);
};

initialize();
