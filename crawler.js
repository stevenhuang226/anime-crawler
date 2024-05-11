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
	const http = require("node:http");
	const url = require("node:url");
	const crypto = require("node:crypto")
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
				let postData = `{"tid":"","vid":"","id":"${element.playerCode}"}`;
				let socket = new WebSocket("wss://v.myself-bbs.com/ws");
				socket.onopen = function(open) {
					console.log("socket opened"); //debug
					socket.send(postData);
				};
				socket.onmessage = (event) => {
					console.log(event.data);
				};
				socket.onerror = (error) => {
					console.log(error);
				}
				setTimeout( () => {
					console.log("socket closing"); //debug
					socket.close(1000, "");
					console.log(socket.readyState); //debug
				}, 3000);
			});
			promises.push(reqWS);
		});
		return Promise.all(promises).then( (results) => {
			for ( let ptr = 0; ptr < episodeObj.length; ptr++ ) {
				episodeObj[ptr].url = results[ptr];
			}
			return episodeObj;
		}).catch( (error) => {
			console.log(error);
		} )
	}).catch( (error) => {
		console.log(error);
	});
}
module.exports = {
	typeOfSite: typeOfSite
}
