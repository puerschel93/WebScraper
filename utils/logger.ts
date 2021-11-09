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

	info = (_information: string): void =>
		console.log(Colors.cyan, 'INFO:\t\t', Colors.white, `${_information}`);

	warn = (_warning: string): void =>
		console.log(Colors.yellow, 'WARNING:\t', Colors.white, `${_warning}`);

	error = (_error: string): void =>
		console.log(Colors.red, 'ERROR:\t\t', Colors.white, `${_error}`);

	success = (_success: string): void =>
		console.log(Colors.green, 'DONE:\t\t', Colors.white, `${_success}`);
}

const logger = new Logger();

export default logger;
