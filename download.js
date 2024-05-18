async function typeOfDownload(epObj, siteType, fileName) {
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
			return await element.function(epObj, fileName);
		}
	}
	console.log("Error Unknow Site Type");
	return -1;
}
async function mySelf(epObj, fileName) {
	const https = require("https");
	const url = require("url");
	const fs = require("fs");
	const urlHostname = url.parse(epObj.url).hostname;
	const urlPathHeader = epObj.url.match(/(?<=com)\/.+\//g)[0];
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(epObj.url).hostname,
			path: url.parse(epObj.url).path,
			method: "GET",
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
				"Referer": "https://v.myself-bbs.com/",
				"Origin": "https://v.myself-bbs.com",
			},
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
	}).then( async (m3u8Data) => {
		const m3u8Arry = m3u8Data.match(/(?<=\n).+\.ts/g);
		const lastOneTs = m3u8Arry[m3u8Arry.length - 1];

		const streamFile = fs.createWriteStream(fileName);
		for ( let element of m3u8Arry ) {
			await new Promise( (resolve,reject) => {
				const reqObj = {
					hostname: urlHostname,
					path: urlPathHeader + element,
					method: "GET",
					headers: {
						"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
						"Referer": "https://v.myself-bbs.com/",
						"Origin": "https://v.myself-bbs.com",
					},
				};
				console.log("%s/%s", element,lastOneTs);
				const reqBody = https.request(reqObj, (response) => {
					if ( response.statusCode !== 200 ) {
						reject(new Error(`failed request ${reqObj.hostname}${reqObj.path}`));
					}
					response.pipe(streamFile, {end: false});
					response.on("end", () => {
						resolve();
					})
				});
				reqBody.on("error", (error) => {
					reject(error);
				});
				reqBody.end();
				process.stdout.write("\b\r");
			}).catch("error", (error) => {
				console.log(error);
			});
		}
		streamFile.end();
		console.log("%s downloaded", fileName);
		return 0;
	}).catch( (error) => {
		console.log(error);
	} )
}
async function animeOne(epObj, fileName) {
	console.log(epObj);
	const https = require("https");
	const fs = require("fs");
	const url = require("url");
	await new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(epObj.url).hostname,
			path: url.parse(epObj.url).path,
			method: "GET",
			family: 4,
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
				"Referer": "https://anime1.me/",
				"Cookie": epObj.cookie
			},
		};
		const streamFile = fs.createWriteStream(fileName);
		const reqBody = https.request(reqObj, (response) => {
			if ( response.statusCode !== 200 ) {
				reject(new Error(`request failed${reqObj.hostname}${reqObj.path}`));
			}
			else {
				console.log("downloading %s", epObj.url);
				response.pipe(streamFile, {end: false});
				response.on("end", () => {
					streamFile.end();
					resolve();
				});
			}
		});
		reqBody.on("error", (error) => {
			reject(error);
		});
		reqBody.end();
	}).then( () => {
		console.log("%s downloaded", epObj.url);
		return 0;
	}).catch("error", (error) => {
		console.log(error);
	});
}
module.exports = {
	typeOfDownload: typeOfDownload,
}
