function animeOne (theUrl) {
	const https = require("https");
	const url = require("url");
	return new Promise ( (resolve,reject) => {
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
				let matchList = originData.match(/data-apireq=".*?(?=")"/g) || ["Error No Data"];
				console.log(matchList);
				resolve(matchList);
			})
		})
		reqBody.on("error", (error) => {
			reject(error);
		})
		reqBody.end();
	})
}

function animeOneApi (theUrl) {
	const https = require("https");
	const url = require("url");
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0"
			}
			//TODO sended data
		};
		const reqBody = https.request(reqObj, (response) => {
			let originData = "";
			response.on("data", (data) => {
				originData += data;
			})
			response.on("end", () => {
			})
		})
	} )
}
console.log(animeOne("https://anime1.me/category/2024%e5%b9%b4%e6%98%a5%e5%ad%a3/%e6%88%91%e5%9b%9e%e4%be%86%e4%ba%86%e3%80%81%e6%ad%a1%e8%bf%8e%e5%9b%9e%e5%ae%b6"));
