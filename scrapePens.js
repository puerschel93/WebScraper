import { initializeBrowser } from './setup.js';
import fs from 'fs';
import $ from 'jquery';

const regex = /(<([^>]+)>)/gi;

/**
 * Initializes the browser and performs login on codepen.io
 */
const initialize = async () => {
	const page = await initializeBrowser();
	const less = JSON.parse(fs.readFileSync('./urls/less-urls.json', 'utf-8'));
	const scss = JSON.parse(fs.readFileSync('./urls/scss-urls.json', 'utf-8'));
	const sass = JSON.parse(fs.readFileSync('./urls/sass-urls.json', 'utf-8'));
	const stylus = JSON.parse(
		fs.readFileSync('./urls/stylus-urls.json', 'utf-8')
	);
	const array = [...less, ...scss, ...sass, ...stylus];
	const unique = [...new Set(array)];

	setTimeout(() => parse(page, unique), 5000);
};

const parse = async (page, array) => {
	for (const url of array) {
		console.log(url);
		await page.goto(url);
		await validate(page);
	}
};

const validate = async (page) => {
	await page.waitForXPath('//*[@id="css-editor-title"]/span[2]');
	const [el] = await page.$x('//*[@id="css-editor-title"]/span[2]');
	let innerHTML = await el.getProperty('innerHTML');
	innerHTML = await innerHTML.jsonValue();
	innerHTML = innerHTML.replaceAll('(', '').replaceAll(')', '').toLowerCase();
	if (innerHTML.length === 0) return;

	const preprocessor = innerHTML;
	const [code] = await page.$x(
		'/html/body/div[2]/div/div[2]/div[4]/div[2]/div[1]/div[6]/div[1]/div/div/div/div[5]'
	);
	let inner = await code.getProperty('innerHTML');
	inner = await inner.jsonValue();
	inner = inner.replace(regex, '');
	return console.log(inner);
};

initialize();
