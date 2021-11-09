import Colors from './colors';

class Logger {
	clear = () => console.clear();

	info = (_information: string): void =>
		console.log(Colors.cyan, 'INFO:\t', Colors.white, `${_information}`);

	warn = (_warning: string): void =>
		console.log(Colors.yellow, 'WARNING:\t', Colors.white, `${_warning}`);

	error = (_error: string): void =>
		console.log(Colors.red, 'WARNING:\t', Colors.white, `${_error}`);
}

const logger = new Logger();

export default logger;
