function g_search(keyword, selectSite)
{
	const req = require("https");
	let promises = [];
	let searchResult = [];
	selectSite.forEach( element => {
		const searchFun = new Promise( (resolve,reject) => {
			const requestObj = {
				hostname: "www.google.com",
				path: "/search?q=" + encodeURIComponent(keyword) + "site%3A" + element.path,
				headers: {
					"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0" 
				}
			}
			const responseBody = req.request(requestObj, (response) => {
				let originData = "";
				let matchArry = [];
				response.on("data", data => {
					originData += data;
				})
				response.on("end", () => {
					let matchAll = originData.match(element.regExp) || [];
					matchAll.forEach( value => {
						if (! matchArry.includes(value)) {
							matchArry.push(value);
						}
					} );
					resolve( matchArry );
				})
			})
			responseBody.on("error", error => {
				reject("Google Search Request Error:\n" + error);
			})
			responseBody.end();
		} );

		promises.push(searchFun);
	} );

	return Promise.all(promises).then(results => {
		results.forEach( result => {
			searchResult.push(...result);
		} );
		return searchResult;
	})
		.catch( error => {
			console.log(error);
			return -1;
		} );
}
/*
 * test

const input = require("readline");
const rl = input.createInterface({
	input: process.stdin,
	output: process.stdout,
});
rl.question( "input : ", async ans => {
	console.log(await g_search(ans, [{path: "myself-bbs.com", regExp: /https:\/\/myself-bbs\.com\/thread-\d{5}-\d{1}-\d{1}\.html/g}]));
} );
*/
