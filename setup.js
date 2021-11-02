import { credentials } from "./credentials.js";
import puppeteer from "puppeteer-extra";

export const initializeBrowser = async () => {
  const loginurl = "https://codepen.io/login";
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(loginurl);
  await page.waitForSelector("#login-email-field");
  await page.waitForSelector("#login-password-field");
  await page.type("#login-email-field", credentials.username);
  await page.type("#login-password-field", credentials.password);
  await page.click("#log-in-button");
  return page;
};
