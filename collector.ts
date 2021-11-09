/**
 * This Class initializes and manages the main collector class.
 * It contains all the methods to fetch and store data.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import Logger from './utils/logger';
import Helpers from './utils/functions';
import Downloader from './downloader';

class Collector {
	page: any;
	filetypes: string[] = ['scss', 'less', 'styl'];
	pageNumber: number = 39;
	range: string = '';
	filetype: string;

	constructor(page: any) {
		this.page = page;
		this.filetype = this.filetypes[0];
	}

	/**
	 * The core function to initialize the data collection.
	 * It manages the current fetched range, the current page number and the filetype.
	 */
	collect = async (): Promise<void> => {
		await this.page.setDefaultNavigationTimeout(60000);

		for (const type of this.filetypes) {
			Logger.info(`Collecting ${type} files`);
			this.filetype = type;
			for (const range of Helpers.ranges) {
				this.range = range;

				// Fallback for when the script is interrupted.
				// Allows to start in the middle of the script.
				if (
					Number.parseInt(range.split('..')[0]) < 3500 &&
					type === 'scss'
				)
					continue;

				while (this.pageNumber <= 95) {
					await this.page.goto(this.buildURL(type));
					Logger.info(
						`Collecting page ${this.pageNumber} in Range ${range}...`
					);
					await this.collectdata();
					await Helpers.sleep();
					Logger.success(`Page ${this.pageNumber} collected.`);
					this.pageNumber++;
				}
				this.pageNumber = 1;
			}
		}
	};

	/**
	 * TODO: write description
	 */
	collectdata = async (): Promise<any> => {
		try {
			await this.page.waitForSelector('.f4');
		} catch (e) {
			Logger.warn('Could not load the page properly.');
			await this.page.reload();
			return await this.collectdata();
		}

		const linkedElements = await this.page.$$('.f4');
		const filtered = this.filterLinks(linkedElements);

		if (filtered.length < 10) {
			Logger.warn(
				`No new files found. Reloading page ${this.pageNumber} ...`
			);
			await this.page.reload();
			return await this.collectdata();
		}

		try {
			const links = await Promise.all(
				filtered.map(async (el) => await el.$('a'))
			);

			const parsed = await this.parseLinks(links);
			await this.fetchFiles(parsed);
		} catch (e) {
			return await this.collectdata();
		}
		return;
	};

	/**
	 * This function filters the links to only include the ones that link to a
	 * collectable file.
	 * @param links The linked elements to filter if they contain a filetype.
	 * @returns an array of filtered elements.
	 */
	filterLinks = (links: any): any[] => {
		return links.filter((div: any) =>
			div._remoteObject.description.includes('text-normal')
		);
	};

	/**
	 * This functions parses the Github Filepage links to the downloadable
	 * links from which the collector can fetch the files.
	 * @param links raw links that are to be parsed
	 * @returns returns an array with all the downloadable links.
	 */
	parseLinks = async (links: any) => {
		return await Promise.all(
			links.map(async (link: any) => {
				const _link = await link.getProperty('href');
				return _link._remoteObject.value
					.replace('blob/', '')
					.replace(
						'https://github.com/',
						'https://raw.githubusercontent.com/'
					);
			})
		);
	};

	/**
	 * This function loops through all passed links and passes them
	 * to the https downloader.
	 * @param links links to be fetched
	 */
	fetchFiles = async (links: any[]) => {
		for (const link of links) {
			Downloader.download(link, this.filetype);
		}
	};

	/**
	 * This function builds the url for the current page based on
	 * the current type, the current page number and the range.
	 * @param type The filetype to collect
	 * @returns The url to the current page
	 */
	buildURL = (type: string): string =>
		'https://github.com/search?l=&p=' +
		this.pageNumber +
		'&q=extension%3A' +
		type +
		'+size%3A' +
		this.range +
		'&type=Code&ref=advsearch&l=&l=';
}

export default Collector;
