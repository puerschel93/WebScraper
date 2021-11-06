import { initializeBrowser } from './setup.js';
import https from 'https';
import fs from 'fs';

const FILETYPES = ['scss', 'sass', 'styl'];

// SCHEDULE WAITTIME TO AVOID IP BAN
const wait = 12500;

const RANGES = [
	'501..1000',
	'1001..1500',
	'1501..2000',
	'2001..2500',
	'2501..3000',
	'3001..3500',
	'3501..4000',
	'4001..4500',
	'4501..5000',
	'5001..5500',
	'5501..6000',
	'6001..6500',
	'6501..7000',
	'7001..7500',
	'7501..8000',
	'8001..8500',
	'8501..9000',
	'9001..9500',
	'9501..10000',
	'10001..11500',
	'10501..11000',
	'11001..11500',
	'11501..12000',
];

const scrape = async () => {
	const page = await initializeBrowser(urlbuilder(2, RANGES[0], 'scss'));
	page.setDefaultNavigationTimeout(wait);

	for (const filetype of FILETYPES) {
		for (const range of RANGES) {
			for (let i = 2; i < 70; i++) {
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
		const index = getNumberOfFilesInDirectory(PATH);
		// prettier-ignore
		const file = fs.createWriteStream(`${PATH}/${index}.${filetype}`);
		return res.pipe(file);
	} catch (error) {
		return console.log(error);
	}
};

const getNumberOfFilesInDirectory = (path) => {
	try {
		const files = fs.readdirSync(path);
		return files.length;
	} catch (error) {
		return 0;
	}
};

scrape();
