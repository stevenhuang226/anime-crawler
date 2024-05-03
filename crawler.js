async function typeOfSite(unknowUrl) {
	const siteRule = [
		{
			name: myself,
			rule: /https:\/\/myself-bbs\.com/
		},
		{
			name: animeOne,
			rule: /https:\/\/anime1.me\.com/
		}
	];
	let rsp = "";
	for (const element of siteRule) {
		if ( element.rule.test(unknowUrl) ) {
			return await myself(unknowUrl);
		}
		else if ( element.rule.test(unknowUrl) ) {
			return await animeOne(unknowUrl);
		}
		else {
			return ""
		}
	}
/*
	await siteRule.forEach( async element => {
		if ( element.rule.test(unknowUrl) ) {
			return await myself(unknowUrl);
		}
		else {
			return "Error Unknow Web Site Url";
		}
	} );
	*/
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
}
module.exports = {
	typeOfSite: typeOfSite
}
