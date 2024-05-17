async function typeOfDownload(theUrl, siteType, fileName) {
	const siteRule = [
		{
			function: mySelf,
			rule: /mySelf/
		},
		/*{
			function: animeOne,
			rule: /animeOne/
		},*/
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
	const fs = require("fs");
	const urlHostname = url.parse(theUrl).hostname;
	const urlPathHeader = theUrl.match(/(?<=com)\/.+\//g)[0];
	console.log("host: ", urlHostname, "path: ", urlPathHeader);
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
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
			});
		}
		streamFile.end();
		console.log("%s downloaded", fileName);
		return 0;
	}).catch( (error) => {
		console.log(error);
	} )
}
module.exports = {
	typeOfDownload: typeOfDownload,
}
