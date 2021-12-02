/**
 * This Class is another Helpers Class collecting unrelated functions
 * which are used in the whole project. The functions are not related to
 * one topic but are useful to manage a bunch of helpful utilities.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import Logger from './logger';

class Helpers {
	static sleeptime: number = 10 * 1000;
	static ranges: string[] = [
		'500..1000',
		'1000..1500',
		'1501..2000',
		'2001..2500',
		'2501..3000',
		'3001..3500',
		'3501..4000',
		'4001..4500',
		'4501..5000',
		'5001..5500',
		'5501..6000',
		'6001..6500',
		'6501..7000',
		'7001..7500',
		'7501..8000',
		'8001..8500',
		'8501..9000',
		'9001..9500',
		'9501..10000',
		'10001..10500',
		'10501..11000',
	];

	/**
	 * Function to sleep for a given time to avoid IP-ban from GitHub or
	 * giving input before elements are rendered.
	 * @param ms - time in milliseconds
	 */
	static sleep = async (ms?: number) => {
		const time = ms ?? this.sleeptime;
		await new Promise((resolve) => setTimeout(resolve, time));
		Logger.info(`Slept for ${time / 1000} seconds.`);
		return;
	};
}

export default Helpers;
