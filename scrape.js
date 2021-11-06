import { initializeBrowser } from './setup.js';
import https from 'https';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { RANGES } from './ranges';
import { PREPROCESSORS } from './preprocessors';

// SCHEDULE WAITTIME TO AVOID IP BAN
const wait = 12500;

const scrape = async () => {
	const page = await initializeBrowser(
		urlbuilder(2, RANGES[0], PREPROCESSORS[0])
	);

	page.setDefaultNavigationTimeout(wait);

	for (const filetype of PREPROCESSORS) {
		for (const range of RANGES) {
			for (let i = 33; i < 70; i++) {
				try {
					await fetch(page, i, range, filetype);
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
};

const fetch = async (page, i, range, filetype) => {
	try {
		await page.waitForSelector('.f4');
	} catch (error) {
		await page.goto(urlbuilder(i, range, filetype));
		return;
	}

	let links = await page.$$('.f4');
	links = await links.filter((div) =>
		div._remoteObject.description.includes('text-normal')
	);

	if (links.length === 0) {
		return;
	}

	try {
		links = await Promise.all(links.map(async (el) => await el.$('a')));
		const parsed = await parselinks(links);
		await fetchParsed(parsed, filetype);
		await sleep(wait);
		await page.goto(urlbuilder(i, range, filetype));
	} catch (e) {
		console.log(e);
	}
};

const parselinks = async (links) => {
	return await Promise.all(
		links.map(async (link) => {
			const _link = await link.getProperty('href');
			return _link._remoteObject.value
				.replace('blob/', '')
				.replace(
					'https://github.com/',
					'https://raw.githubusercontent.com/'
				);
		})
	);
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const urlbuilder = (page, range, filetype) => {
	return `https://github.com/search?l=&p=${page}&q=extension%3A${filetype}+size%3A${range}&type=Code&ref=advsearch&l=&l=`;
};

const fetchParsed = (links, filetype) => {
	for (const url of links) {
		try {
			https.get(url, (res) => {
				try {
					return saveFileFromHttpResponse(res, filetype);
				} catch (e) {
					return console.log(e);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}
	return;
};

const saveFileFromHttpResponse = (res, filetype) => {
	try {
		const PATH = `./output/${filetype}`;
		const id = uuidv4();
		// prettier-ignore
		const file = fs.createWriteStream(`${PATH}/${id}.${filetype}`);
		console.log(`wrote ${PATH}/${id}.${filetype}`);
		return res.pipe(file);
	} catch (error) {
		return console.log(error);
	}
};

scrape();
