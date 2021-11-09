import AUTH from './auth';

class Collector {
	type: string;

	constructor(type: string) {
		this.type = type;
	}
}

const c = new Collector('sass');

c.octocrawl();
