import { initializeBrowser } from './setup.js';
import https from 'https';
import fs from 'fs';

const FILETYPE = 'scss';

// SCHEDULE WAITTIME TO AVOID IP BAN
const wait = 20000;

const scrape = async () => {
	const page = await initializeBrowser(urlbuilder(2));
	page.setDefaultNavigationTimeout(wait);

	for (let i = 3; i < 100; i++) {
		await fetch(page, i);
	}
};

const fetch = async (page, i) => {
	try {
		await page.waitForSelector('.f4');
	} catch (error) {
		await page.goto(urlbuilder(i));
		return;
	}
	let links = await page.$$('.f4');
	links = await links.filter((div) =>
		div._remoteObject.description.includes('text-normal')
	);

	if (links.length === 0) {
		return;
	}

	links = await Promise.all(links.map(async (el) => await el.$('a')));

	const parsed = await parselinks(links);
	await fetchParsed(parsed);
	await sleep(wait);
	await page.goto(urlbuilder(i));
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

const urlbuilder = (page) => {
	return `https://github.com/search?l=&p=${page}&q=extension%3A${FILETYPE}&type=Code&ref=advsearch&l=&l=`;
};

const fetchParsed = (links) => {
	for (const url of links) {
		https.get(url, (res) => saveFileFromHttpResponse(res));
	}
	return;
};

const saveFileFromHttpResponse = (res) => {
	const PATH = `./output/${FILETYPE}`;
	const index = getNumberOfFilesInDirectory(PATH);
	// prettier-ignore
	const file = fs.createWriteStream(`${PATH}/${index}.${FILETYPE}`);
	return res.pipe(file);
};

const getNumberOfFilesInDirectory = (path) => {
	const files = fs.readdirSync(path);
	return files.length;
};

scrape();
