import Collector from './collector';
import Browser from './browser';
import Logger from './utils/logger';

/**
 * Main-Function that initializes the collecting mechanism
 * to gather files with a given file-extension.
 */
const main = async () => {
	Logger.info('Starting the file-collector.');

	const browser = new Browser(false);
	const page = await browser.initialize();

	Logger.info('Finishing the the file-collector.');
	return browser.close();
};

main();
