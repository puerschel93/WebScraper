import fs from 'fs';

let totalCount = 0;

const readfiles = () => {
	const dir = './output/styl/';
	const files = fs.readdirSync(dir);

	// readFileLineByLine(dir, files[1]);

	for (const filename of files) {
		readFileLineByLine(dir, filename);
	}

	console.log(totalCount);
};

const readFileLineByLine = (dir, filename) => {
	if (filename === '.DS_Store') return;

	const file = fs.readFileSync(dir + filename, 'utf8');
	const lines = file.split('\n');
	let count = 0;

	for (const line of lines) {
		if (line.includes('if ')) count++;
	}

	if (count > 0) {
		console.log(filename, count);
		totalCount++;
	}
};

readfiles();
