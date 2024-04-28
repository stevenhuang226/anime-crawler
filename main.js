const nodeio = require("readline");
const nodeInput = nodeio.createInterface( {
	input: process.stdin,
	output: process.stdout,
} );
const siteInfo = [
	{
		path: "myself-bbs.com",
		regExp: /https:\/\/myself-bbs\.com\/thread-\d{5}-\d{1}-\d{1}\.html/g
	}
]
const webSearch = require("./search.js");
nodeInput.question("Input Anime Title:", async ans => {
	let searchResult = await webSearch.g_search(ans, siteInfo);
	let titleArry = await webSearch.reqTitle(searchResult);
	console.log(searchResult);
	console.log(titleArry);
	process.exit(0);
});
