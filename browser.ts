import AUTH from './auth';
import puppeteer from 'puppeteer-extra';
import Colors from './colors';

/**
 * This Class initializes and handles the browser to provide a
 * Browserpage to the Collector Class, which collects files from Github.
 */
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
		await this.sleep(2000);
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
		console.log(Colors.yellow, 'Closing browser...');
		await this._browser?.close();
		console.log(Colors.yellow, 'Done.');
	};

	/**
	 * Function to sleep for a given time to avoid IP-ban from GitHub or
	 * giving input before elements are rendered.
	 * @param ms - time in milliseconds
	 */
	sleep = (ms?: number) => {
		const time = ms ?? this.sleeptime;
		new Promise((resolve) => setTimeout(resolve, time));
	};
}

export default Browser;
