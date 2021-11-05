import fs from 'fs';

const removeAllHTMLTags = (str) => {
	if (str) {
		return str.replace(/<[^>]*>/g, '');
	}
	return '';
};

const readFile = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

const initialize = async () => {
	const file = await readFile('./simple.rtf');
	const cleaned = removeAllHTMLTags(file);
	console.log(cleaned);
};

initialize();
