async function typeOfSite(unknowUrl) {
	const siteRule = [
		{
			name: myself,
			rule: /https:\/\/myself-bbs\.com/
		},
		{
			name: animeOne,
			rule: /https:\/\/anime1\.me/
		}
	];
	for (const element of siteRule) {
		if ( element.rule.test(unknowUrl) ) {
			return await element.name(unknowUrl);
		}
	}
	console.log("Erro Unknown Url Type");
	return -1;
};
async function myself(theUrl) {
	const https = require("https");
	const url = require("url");
	return new Promise( (resolve,reject) => {
		const requestObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0"
			}
		};
		const reqBody = https.request(requestObj, (response) => {
			let originData = "";
			response.on("data", (data) => {
				originData += data;
			})
			response.on("end", async () => {
				let episodeObj = [{}];
				let ret = await originData.match(/[\s\S]{100}myself-bbs.com\/player\/.*/g) || ["Error No Match Url"];
				for ( let ptr = 0; ptr < ret.length ; ptr++ ) {
					episodeObj[ptr] = {title: "Error No Data", url: "Error No Data"}
					episodeObj[ptr]["title"] = ret[ptr].match(/javascript:;">.*<\/a>/g)[0].replace(/javascript:;">/, "").replace(/<\/a>/, "");
					episodeObj[ptr]["url"] = ret[ptr].match(/myself-bbs.com\/player\/.*/g)[0];
				}
				resolve(episodeObj);
			});
		})
		reqBody.on("error", (error) => {
			reject(error);
		})
		reqBody.end();
	}).then( (ret) => {
		return ret;
	} ).catch( (error) => {
		console.log(error);
		return (-1);
	});
};
async function animeOne(theUrl) {
	const https = require("https");
	const url = require("url");
	let titleArry = [];
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			header: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0"
			}
		};
		const reqBody = https.request(reqObj, (response) => {
			let originData = "";
			let apireqList = [];
			response.on("data", (data) => {
				originData += data;
			})
			response.on("end", async () => {
				let matchList = await originData.match(/data-apireq="[^"].*?"/g) || ["Error No Data"];
				let titles = await originData.match(/rel="bookmark">[^<].*?<\/a>/g) || ["Error No Data"];
				if ( matchList.length != titles.length ) {
					console.log("Error anime1 crawler: miss anime url or title");
				}
				for ( let ptr = 0; ptr < matchList.length; ptr++ ) {
					apireqList[ptr] = matchList[ptr].replace(/data-apireq="/, "").replace(/"/, "");
					titleArry[ptr] = titles[ptr].replace(/rel="bookmark">/, "").replace(/<\/a>/, "");
				}
				resolve(apireqList);
			})
		})
		reqBody.on("error", (error) => {
			reject(error);
		})
		reqBody.end();
	} ).then( (apireqList) => {
		let promises = [];
		apireqList.forEach( (apireqData) => {
			const postToApi = new Promise( (resolve,reject) => {
				const postData = `d=${apireqData}`;
				const reqObj = {
					hostname: "v.anime1.me",
					path: "/api",
					method: "POST",
					credentials: "omit",
					headers: {
						"Accept": "*/*",
						"Accept-Language": "en-us,en;q=0.5",
						"Content-Type": "application/x-www-form-urlencoded",
						"Content-Length": postData.length,
						"Sec-GPC": "1",
						"Sec-Fetch-Dest": "empty",
						"Sec-Fetch-Mode": "no-cors",
						"Sec-Fetch-Site": "same-site",
						"Progrma": "no-cache",
						"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.3",
						"origin": "https://anime1.me",
						"referer": "https://anime1.me/",
					}
				};
				const reqBody = https.request(reqObj, (response) => {
					let originData = "";
					response.on("data", (data) => {
						originData += data;
					})
					response.on("end", () => {
						let matchArry = originData.match(/src":"[^,].*?"/g) || ["Error No Data"];
						resolve(matchArry[0].replace(/src":"/, "").replace(/"/, ""));
					})
				})
				reqBody.on("error", (error) => {
					reject(error);
				})
				reqBody.write(postData)
				reqBody.end();
			});
			promises.push(postToApi);
		})
		return Promise.all(promises).then( (results) => {
			let resultArry = [];
			results.forEach( (result) => {
				resultArry.push(result);
			} )
			return resultArry;
		} ).catch( (error) => {
			console.log("Error request api url\n",error);
			return -1;
		} );
	} ).then( (urlArry) => {
		let episodeObj = [{}];
		for ( let ptr = 0; ptr < urlArry.length; ptr++ ) {
			episodeObj[ptr] = {title: "Error No Data", url: "Error No Data"};
			episodeObj[ptr]["title"] = titleArry[ptr];
			episodeObj[ptr]["url"] = urlArry[ptr];
		}
		return episodeObj;
	} ).catch( (error) => {
		console.log("Error request anime1 url", error);
		return -1;
	} );
}
module.exports = {
	typeOfSite: typeOfSite
}
