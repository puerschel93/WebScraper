/**
 * This class offers a line-by-line Parser for Stylsheet-files
 * using either the 'scss', 'less' or 'stylus' syntax.
 * @author Florian Pürschel
 * @version 1.0
 * @url	www.prshl.de
 */

import fs from 'fs';

class Parser {
	readDir(dir: string): string[] {
		const files = fs.readdirSync(dir);
		console.log(files.length);
		return files;
	}
}
