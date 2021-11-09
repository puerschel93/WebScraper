/**
 * Simple Logger class which gathers various log levels which outputs
 * and formats inputs in console to display information, warnings, erros and
 * success messages differently.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import Colors from './colors';

class Logger {
	clear = () => console.clear();

	info = (message: string): void =>
		console.log(Colors.cyan, 'INFO:\t\t', Colors.white, `${message}`);

	warn = (message: string): void =>
		console.log(Colors.yellow, 'WARNING:\t', Colors.white, `${message}`);

	error = (message: string): void =>
		console.log(Colors.red, 'ERROR:\t\t', Colors.white, `${message}`);

	success = (message: string): void =>
		console.log(Colors.green, 'DONE:\t\t', Colors.white, `${message}`);
}

const logger = new Logger();

export default logger;
