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
	console.log(await webSearch.g_search(ans, siteInfo))
	process.exit(0);
});
