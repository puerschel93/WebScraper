import { initializeBrowser } from './setup.js';
import fs from 'fs';

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
	for (const [index, url] of array.entries()) {
		try {
			await page.goto(url);
			await parseCSS(page, index);
		} catch (error) {}
	}
};

const parseCSS = async (page, index) => {
	try {
		await page.waitForXPath('//*[@id="css-editor-title"]/span[2]');
		const [el] = await page.$x('//*[@id="css-editor-title"]/span[2]');
		let innerHTML = await el.getProperty('innerHTML');
		innerHTML = await innerHTML.jsonValue();
		innerHTML = innerHTML
			.replaceAll('(', '')
			.replaceAll(')', '')
			.toLowerCase();

		const preprocessor = innerHTML;

		if (preprocessor.length === 0) return;

		const editors = await page.$x(
			'//*[@id="box-css"]/div[2]/div[1]/div[6]/div[1]/div/div/div/div[5]'
		);
		const editor = await editors[0].getProperty('innerHTML');
		const val = removeAllHTMLTags(editor._remoteObject.value)
			.replace(/\n/g, '')
			.replace(/\t/g, '')
			.replace(/\s/g, '');

		const numberOfFiles = await getNumberOfFilesInDirectory(
			`./pens/${preprocessor}/`
		);
		writeFile(
			val,
			`${preprocessor}-${numberOfFiles}`,
			`./pens/${preprocessor}/`,
			mapPreprocessorToFileName(preprocessor)
		);
	} catch (error) {
		console.log(error);
	}
	return;
};

const removeAllHTMLTags = (str) => {
	if (str) {
		return str.replace(/<[^>]*>/g, '');
	}
	return '';
};

const writeFile = async (text, fileName, path, filetype) => {
	fs.writeFile(`${path}/${fileName}.${filetype}`, text, (err) => {
		if (err) throw err;
		console.log(`${fileName} saved!`);
	});
};

const getNumberOfFilesInDirectory = async (path) => {
	const files = await fs.readdirSync(path);
	return files.length;
};

const mapPreprocessorToFileName = (preprocessor) => {
	switch (preprocessor) {
		case 'less':
			return 'less';
		case 'scss':
			return 'scss';
		case 'sass':
			return 'sass';
		case 'stylus':
			return 'styl';
		default:
			return 'css';
	}
};

initialize();
