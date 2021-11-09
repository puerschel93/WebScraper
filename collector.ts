import { Octokit } from '@octokit/rest';
import AUTH from './auth';

class Collector {
	type: string;
	octokit: Octokit;

	constructor(type: string) {
		this.type = type;
		this.octokit = new Octokit({
			auth: AUTH.token,
		});
	}

	octocrawl = async () => {
		const response = await this.octokit.search.code({
			q: `extension:${this.type}`,
			order: 'desc',
			per_page: 100,
		});

		console.log(response.data.items.length);
	};
}

const c = new Collector('sass');

c.octocrawl();
