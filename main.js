const https = require('https');
const m3u8RequestInfo = {
	hostname: 'vpx05.myself-bbs.com',
	path: '/hls/_R/gA/Ah/AgAD_RgAAhoggVQ/index.m3u8',
	method: 'GET',
	headers: {
		'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
		'Accept': '*/*',
		'Accept-Language': 'en-US,en;q=0.5',
		'Accept-Encoding': 'gzip, deflate, br',
		'Referer': 'https://v.myself-bbs.com/',
		'Origin': 'https://v.myself-bbs.com',
		'Connection': 'keep-alive',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-site'
	}
}

const req = https.request( m3u8RequestInfo, response => {
	console.log('status: ',response.statusCode);
	response.on('data', data => {
		console.log(data.toString());
	});
})

req.on('error', error => {
	console.log('error', error);
})
req.end();
