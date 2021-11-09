/**
 * The WebScraper Project was created to collect files from GitHub without
 * getting stuck in the GitHub-API-Rate-Limits.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import Collector from './collector';
import Browser from './browser';
import Logger from './utils/logger';

/**
 * Main-Function that initializes the collecting mechanism
 * to gather files with a given file-extension.
 */
const main = async () => {
	Logger.clear();

	const now = performance.now();
	Logger.info('Starting the file-collector.');

	const browser = new Browser();
	const page = await browser.initialize();

	const collector = new Collector(page);

	await collector.collect();

	Logger.info('Finishing the the file-collector.');

	const time = (performance.now() - now) / 1000 / 60 / 60;
	Logger.info(`The file-collector took ${time} hours to finish.`);
	return browser.close();
};

main();
