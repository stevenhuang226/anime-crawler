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
		let episodeObj = await crawler.typeOfSite(searchResult[ans]);
		console.log(episodeObj);
		await myselfDownload(episodeObj[0].url);
	});
};
searchFun();

async function myselfDownload(theUrl) {
	const https = require("https");
	const url = require("url");
	const agent = https.Agent({
		keepAlive: true,
	})
	const reqObj = {
		hostname: theUrl.match(/.+\.myself-bbs\.com/)[0],
		path: theUrl.match(/(?<=.+\.myself-bbs\.com).+\.m3u8/)[0],
		method: "GET",
		family: 4,
		agent: agent,
		headers: {
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0",
			"Accept": "*/*",
			"Accept-Language": "en-US,en;q=0.5",
			"Referer": "https://v.myself-bbs.com/",
			"Origin": "https://v.myself-bbs.com",
			"Connection": "keep-alive",
			"Sec-Fetch-Dest": "empty",
			"Sec-Fetch-Mode": "no-cors",
			"Sec-Fetch-Site": "same-site",
			"Pragma": "no-cache",
			"Cache-Control": "no-cache",
		}
	};
	console.log(reqObj);
	const reqBody = https.request(reqObj, (res) => {
		console.log(res.statusCode);
		originData = "";
		res.on("data", (data) => {
			originData += data;
		});
		res.on("end", () => {
			console.log(originData);
		});
	});
	reqBody.on("error", (error) => {
		console.log(error);
	});
	reqBody.end();
}
