async function myselfDownload(theUrl) {
	const https = require("https");
	const url = require("url");
	const reqObj = {
		//hostname: theUrl.match(/.+\.myself-bbs\.com/)[0],
		hostname: url.parse(theUrl).hostname,
		//path: theUrl.match(/(?<=.+\.myself-bbs\.com).+\.m3u8/)[0],
		path: url.parse(theUrl).path,
		method: "GET",
		family: 4,
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"Referer": "https://v.myself-bbs.com/",
			"Origin": "https://v.myself-bbs.com",
			"Connection": "keep-alive",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "no-cors",
			"Sec-Fetch-Site": "same-site",
			"Pragma": "no-cache",
			"Cache-Control": "no-cache",
		}
	};
	console.log(reqObj);
	const reqBody = https.request(reqObj, (res) => {
		console.log(res.statusCode);
		originData = "";
		res.on("data", (data) => {
			originData += data;
		});
		res.on("end", () => {
			console.log(originData);
		});
	});
	reqBody.on("error", (error) => {
		console.log(error);
	});
	reqBody.end();
}

async function typeOfDownload(theUrl, siteType, fileName) {
	const siteRule = [
		{
			function: mySelf,
			rule: /mySelf/
		},
		{
			function: animeOne,
			rule: /animeOne/
		},
	];
	for ( let element of siteRule ) {
		if (element.rule.test(siteType) ) {
			return await element.function(theUrl, fileName);
		}
	}
	console.log("Error Unknow Site Type");
	return -1;
}
async function mySelf(theUrl, fileName) {
	const https = require("https");
	const url = require("url");
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
				"Accept": "*/*",
				"Accept-Language": "en-US,en;q=0.5",
				"Referer": "https://v.myself-bbs.com/",
				"Origin": "https://v.myself-bbs.com",
				"Connection": "keep-alive",
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "no-cors",
				"Sec-Fetch-Site": "same-site",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache",
			};
		};
		const reqBody = https.request(reqObj, (response) => {
			let originData = "";
			response.on("data", (data) => {
				originData += data;
			});
			response.on("end", () => {
				resolve(originData);
			});
		});
		reqBody.on("error", (error) => {
			reject(error);
		});
		reqBody.end();
	}).then( (m3u8Url) => {
		//TODO parse m3u8 file
	}).catch( (error) => {
		console.log(error);
	} )
}
