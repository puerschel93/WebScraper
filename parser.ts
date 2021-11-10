/**
 * This class offers a line-by-line Parser for Stylsheet-files
 * using either the 'scss', 'less' or 'stylus' syntax.
 * @author Florian Pürschel
 * @version 1.0
 * @url	www.prshl.de
 */

import fs from 'fs';

class Parser {
	/**
	 *
	 * @param file
	 * @returns
	 */
	readfile(file: string): string {
		return fs.readFileSync(file, 'utf8');
	}
}
