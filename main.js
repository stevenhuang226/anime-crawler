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
const downloader = require("./download.js")
function searchFun() {
	nodeInput.question("Input Anime Title:", async ans => {
		console.log("searching...");
		let searchResult = await webSearch.g_search(ans, siteInfo);
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
		if ( ['quit','q','n','not'].includes(ans) ) {
			process.exit(0);
		}
		console.log(`Selected: ${titleArry[ans]}(${searchResult[ans]})`);
		console.log(`Try to request html from: ${searchResult[ans]}`);
		const [episodeObj, siteType] = await crawler.typeOfSite(searchResult[ans]);
		console.log(episodeObj);
		episodeObj.forEach( (element, index) => {
			console.log("code: %d\n  title: %s\n  url: %s\n-----end-----\n", index+1, element.title, element.url);
		})
		downloadFun(episodeObj, siteType);
	});
};
function downloadFun(episodeObj, siteType) {
	nodeInput.question("input structure code:path, code:path ...\nor all:/path/to/folder\nor input 'n' to quit script\n==>", async ans => {
		if (["n","N","not","Not","NOT"].includes(ans) ) {
			console.log("quit");
			process.exit(0);
		}
		else if (/all/.test(ans)) {
			console.log("autoName...");
			return new Promise( (resolve) => {
				let selectFolder = ans.split(/\s*:\s*/)[1];
				if ( ! selectFolder.endsWith("/") ) {
					selectFolder += "/";
				}
				resolve(selectFolder);
			} ).then( async (selectFolder) => {
				for ( let ptr = 0; ptr < episodeObj.length; ptr++ ) {
					await downloader.typeOfDownload(episodeObj[ptr], siteType, selectFolder+(ptr+1)+".mp4");
				}
				process.exit(0);
			} );
		}
		else {
			return new Promise( (resolve) => {
				const selectArry = ans.split(/\s*,\s*/);
				let downloadStruct = [];
				selectArry.forEach( (element,index) => {
					let [num, fileName] = element.split(/\s*:\s*/);
					downloadStruct.push({ep: (+num)-1, fileName: fileName});
				});
				resolve(downloadStruct);
			}).then( async (downloadStruct) => {
				for ( let element of downloadStruct ) {
					await downloader.typeOfDownload(episodeObj[element.ep], siteType, element.fileName);
				}
				process.exit(0);
			});
		}
	});
};
searchFun();
