/**
 * This Class is a simple downloader for the files. It is used to gather all
 * the https download related functions in one place and make them accessible
 * without importing the whole downloader.ts file atomically.
 * @author Florian Pürschel
 * @version 1.0.0
 * @url www.prshl.de
 */

import fs from 'fs';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';
import Logger from './utils/logger';

class Downloader {
	/**
	 * This function actually downloads the file from the url and passes
	 * the file to the saving function.
	 * @param links the links to download
	 * @param filetype the filetypes that are the target of the download
	 * @returns void
	 */
	download = (url: string, filetype: string) => {
		try {
			https.get(url, (res) => {
				try {
					return this.saveFileFromHttpResponse(res, filetype);
				} catch (e) {
					return console.log(e);
				}
			});
		} catch (error) {
			console.log(error);
		}
		return;
	};

	/**
	 * This functions writes a file in a directory according to the given file extension.
	 * @param res an http response containing the file to write
	 * @param filetype the filetype containing the directory where the files have to be saved
	 */
	saveFileFromHttpResponse = (res: any, filetype: string) => {
		try {
			const PATH = `./output/${filetype}`;
			const id = uuidv4();
			const file = fs.createWriteStream(`${PATH}/${id}.${filetype}`);
			Logger.success(`wrote ${PATH}/${id}.${filetype}`);
			return res.pipe(file);
		} catch (error) {
			return Logger.error('Could not save file to directory.');
		}
	};
}

const downloader = new Downloader();

export default downloader;
