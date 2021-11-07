import fs from 'fs';

let totalCount = 0;
const regex = '';

const readfiles = () => {
	const dir = './output/styl/';
	const files = fs.readdirSync(dir);

	for (const filename of files) {
		readFileLineByLine(dir, filename);
	}
};

const readFileLineByLine = (dir, filename) => {
	if (filename === '.DS_Store') return;

	const file = fs.readFileSync(dir + filename, 'utf8');
	const lines = file.split('\n');
	let count = 0;

	for (const line of lines) {
		if (line.match(regex)) count++;
	}

	if (count > 0) totalCount++;
};

readfiles();
