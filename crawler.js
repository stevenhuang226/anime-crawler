async function typeOfSite(unknowUrl) {
	const siteRule = [
		{
			name: myself,
			rule: /https:\/\/myself-bbs\.com/
		}
	];
	let rsp = "";
	await siteRule.forEach( async element => {
		if ( element.rule.test(unknowUrl) ) {
			rsp = await myself(unknowUrl);
		}
		else {
			rsp = "Error Unknow Web Site Url";
		}
	} );
	return rsp;
};
async function myself(theUrl) {
	console.log("test", theUrl); // debug;
	/*
	const https = require("https");
	const url = require("url");
	const requestObj = {
		hostname: url.parse(theUrl),
		path: url.parse(theUrl),
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0"
		}
	}
	*/
};
module.exports = {
	typeOfSite: typeOfSite
}
