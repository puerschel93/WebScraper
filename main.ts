import Collector from './collector';
import Browser from './browser';
import Colors from './colors';

const main = async () => {
	console.log(Colors.cyan, 'Starting...');
	const browser = new Browser(false);
	const page = await browser.initialize();
	return browser.close();
};

main();
