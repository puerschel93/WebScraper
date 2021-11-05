import { credentials } from './credentials.js';
import puppeteer from 'puppeteer-extra';
import { sleep } from './scrape.js';

export const initializeBrowser = async (url) => {
	const browser = await puppeteer.launch({
		headless: false,
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitForSelector('#login_field');
	await page.waitForSelector('#password');
	sleep(1000);
	await page.type('#login_field', credentials.username);
	sleep(1000);
	await page.type('#password', credentials.password);
	sleep(2000);
	const signin = await page.$x('//*[@id="login"]/div[4]/form/div/input[12]');
	await signin[0].click();

	return page;
};
