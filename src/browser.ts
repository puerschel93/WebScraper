/**
 * This Class initializes and handles the browser to provide a
 * Browserpage to the Collector Class, which collects files from Github.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import AUTH from './utils/auth';
import puppeteer from 'puppeteer-extra';
import Logger from './utils/logger';
import Helpers from './utils/functions';

class Browser {
	sleeptime: number = 10 * 1000;
	url: string = 'https://github.com/login';
	headless: boolean;
	_browser?: any;

	constructor(headless: boolean = true) {
		this.headless = headless;
	}

	/**
	 * Initializes the browser
	 * @returns page - current browser tab with search
	 */
	initialize = async (): Promise<Object> => {
		const browser = await puppeteer.launch({
			headless: this.headless,
		});
		const page = await browser.newPage();
		await page.goto(this.url);
		await page.waitForSelector('#login_field');
		await page.waitForSelector('#password');
		await Helpers.sleep(2000);
		await page.type('#login_field', AUTH.username);
		await page.type('#password', AUTH.password);
		const button = await page.$x(
			'//*[@id="login"]/div[4]/form/div/input[12]'
		);
		await button[0].click();
		await page.waitForNavigation();
		this._browser = browser;
		return page;
	};

	/**
	 * Function to close the browser after all actions are done.
	 */
	close = async () => {
		Logger.info('Closing the browser...');
		await this._browser?.close();
		Logger.info('Done.');
	};
}

export default Browser;
