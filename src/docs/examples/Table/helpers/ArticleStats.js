function getRandomTitle (str) {
	let title = str.split(' ')
		.sort((a, b) => Math.random() > 0.5 ? -1 : 1)
		.join(' ');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

const baseTitle = 'tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet';
const baseStat = {
	total: 0,
	abstractViews: 0,
	totalGalleyViews: 0,
	pdf: 0,
	html: 0,
	other: 0,
	object: {
		id: 1,
		fullTitle: {
			en_US: getRandomTitle(baseTitle),
		},
		authorString: 'Carlo Corino',
		urlPublished: '/example/1',
	},
};

let stats = [];
for (let i = 1; i < 61; i++) {
	let stat = {
		...baseStat,
		object: {
			...baseStat.object,
			id: i,
			fullTitle: {
				en_US: getRandomTitle(baseTitle),
			},
		},
		abstractViews: Math.floor(Math.random() * 10000) + 1,
		totalGalleyViews: Math.floor(Math.random() * 1000) + 1,
	};

	let sixth = Math.floor(stat.totalGalleyViews / 6);
	stat.pdf = sixth * 3;
	stat.html = sixth * 2;
	stat.other = sixth * 1;
	stat.total = stat.abstractViews + stat.totalGalleyViews;

	stats.push(stat);
}

export default stats;
