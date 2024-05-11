const nodeio = require("readline");
const nodeInput = nodeio.createInterface( {
	input: process.stdin,
	output: process.stdout,
} );
const siteInfo = [
	{
		path: "myself-bbs.com",
		regExp: /https:\/\/myself-bbs\.com\/thread-\d{4,6}-\d{1,2}-\d{1,2}\.html/g
	},
	{
		path: "anime1.me",
		regExp: /https:\/\/anime1\.me\/category\/[^\s"&]+/g
	}
]
const webSearch = require("./search.js");
const crawler = require("./crawler.js");
function searchFun() {
	nodeInput.question("Input Anime Title:", async ans => {
		console.log("searching...");
		let searchResult = await webSearch.g_search(ans, siteInfo);
		//console.log(searchResult);
		let titleArry = await webSearch.reqTitle(searchResult);
		process.stdout.write("\b\r");
		titleArry.forEach( (element, index) => {
			console.log(`${index} ${element}`);
		});
		selectFun(titleArry, searchResult);
	});
};
function selectFun(titleArry, searchResult) {
	nodeInput.question("Select One(number):", async ans => {
		process.stdout.write("\b\r");
		console.log(`Selected: ${titleArry[ans]}(${searchResult[ans]})`);
		console.log(`Try to request html from: ${searchResult[ans]}`);
		console.log( await crawler.typeOfSite(searchResult[ans]) );
		process.exit(0);
	});
};
searchFun();
