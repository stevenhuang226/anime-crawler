function animeOne (theUrl) {
	const https = require("https");
	const url = require("url");
	return new Promise ( (resolve,reject) => {
		const requestObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.3"
			}
		};
		const reqBody = https.request(requestObj, (response) => {
			let originData = "";
			let repList = [];
			response.on("data", (data) => {
				originData += data;
			})
			response.on("end", async () => {
				let matchList = await originData.match(/data-apireq=".*?(?=")"/g) || ["Error No Data"];
				for ( let ptr = 0; ptr < matchList.length; ptr++ ) {
					repList[ptr] = matchList[ptr].replace(/data-apireq="/, "").replace(/"/, "");
				}
				resolve(repList);
			})
		})
		reqBody.on("error", (error) => {
			reject(error);
		})
		reqBody.end();
	}).then( (repList) => {
		return repList;
	} ).catch( (error) => {
		console.log("Error(anime1):\n", error);
		return -1;
	} );
}

async function animeOneApi(apiReqList) {
	const https = require("https");
	const http = require("http");
	const url = require("url");
	let promises = [];
	let responseList = [];
	apiReqList.forEach( (apiReq)  => {
		const postToApi = new Promise( (resolve,reject) => {
			const postData = `d=${apiReq}`
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
					"DNT": "1",
					"Sec-GPC": "1",
					"Sec-Fetch-Dest": "empty",
					"Sec-Fetch-Mode": "no-cors",
					"Sec-Fetch-Site": "same-site",
					"Progrma": "no-cache",
					"User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.3"
					"origin": "https://anime1.me",
					"referer": "https://anime1.me/",

				}
			};
			const reqBody = https.request(reqObj, (response) => {
				let originData = "";
				let decodeData = "";
				response.on("data", (data) => {
					originData += data;
				})
				response.on("end", () => {
					resolve(originData);
				})
			})
			reqBody.on("error", (error) => {
				reject(error);
			})
			reqBody.write(postData)
			reqBody.end();
		} );
		promises.push(postToApi);
	});
	return Promise.all(promises).then( results => {
		results.forEach( result => {
			responseList.push(result);
		} );
		return responseList;
	} ).catch( (error) => {
		console.log(error);
		return -1;
	} )
}
async function test() {
	const a = await animeOne("https://anime1.me/category/2024%e5%b9%b4%e6%98%a5%e5%ad%a3/%e6%88%91%e5%9b%9e%e4%be%86%e4%ba%86%e3%80%81%e6%ad%a1%e8%bf%8e%e5%9b%9e%e5%ae%b6");
	console.log(a);
	let b = await animeOneApi(a);
	console.log(b);
};

test();
