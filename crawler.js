async function typeOfSite(unknowUrl) {
	const siteRule = [
		{
			function: mySelf,
			rule: /https:\/\/myself-bbs\.com/
		},
		/*
		{
			function: animeOne,
			rule: /https:\/\/anime1\.me/
		}*/
	];
	for ( let element of siteRule ) {
		if ( element.rule.test(unknowUrl) ) {
			return await element.function(unknowUrl);
		}
	}
	console.log("Error Unknow Url Type");
	return -1;
};

async function mySelf(theUrl) {
	const https = require("node:https");
	const url = require("node:url");
	return new Promise( (resolve,reject) => {
		const reqObj = {
			hostname: url.parse(theUrl).hostname,
			path: url.parse(theUrl).path,
			method: "GET",
			family: 4,
			headers: {
				"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0",
			},
		};
		const reqBody = https.request(reqObj, (response) => {
			let originData = "";
			response.on("data", (data) => {
				originData += data.toString();
			})
			response.on("end", async () => {
				let episodeObj = [];
				let ret = await originData.match(/[\s\S]{100}myself-bbs.com\/player\/.*/g) || ["Error No Data"];
				for ( let ptr = 0; ptr < ret.length; ptr++ ) {
					episodeObj[ptr] = {title: "Error No Data", playerCode: "Error No Data", url: "Error No Data"};
					episodeObj[ptr]["title"] = ret[ptr].match(/javascript:;">.*<\/a>/g)[0].replace(/javascript:;">/, "").replace(/<\/a>/, "");
					episodeObj[ptr]["playerCode"] = ret[ptr].match(/myself-bbs\.com\/player\/.*/g)[0].replace(/myself-bbs\.com\/player\//, "");
				}
				resolve(episodeObj);
			});
		});
		reqBody.on("error", (error) => {
			reject(error);
		});
		reqBody.end();
	}).then( (episodeObj) => {
		let promises = [];
		episodeObj.forEach( (element) => {
			const reqWS = new Promise( (resolve,reject) => {
				let originData = "";
				const postData = `{"tid":"","vid":"","id":"${element.playerCode}"}`;
				console.log(postData);
				const reqObj = {
					hostname: "v.myself-bbs.com",
					path: "/ws",
					// TODO: need Sec-WebSocket-xxx header
				};
				const reqBody = https.request(reqObj);
				reqBody.on("connect", (response,socket) => {
					socket.on("data", (data) => {
						originData += data.toString();
					});
					socket.on("end", () => {
						reqBody.abort();
					});
					socket.write(postData);
					setTimeout ( function() {
						reqBody.abort();
						console.log(originData);
						resolve(originData);
					}, 1000);
				});
				reqBody.on("error", function() {
					reject(error);
				});
				reqBody.on("timeout", function() {
					reject("Error: timeout");
				})
				setTimeout(function () {
					console.log("timeout");
					reqBody.abort();
				}, 2000)
				reqBody.end();
			})
			promises.push(reqWS);
		});
		return Promise.all(promises).then( (results) => {
			for ( let ptr = 0; ptr < episodeObj.length; ptr++ ) {
				episodeObj[ptr].url = results[ptr];
			}
			return episodeObj;
		}).catch( (error) => {
			reject(error);
		} )
	}).catch( (error) => {
		console.log(error);
	});
}
module.exports = {
	typeOfSite: typeOfSite
}
