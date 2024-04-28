async function g_search(keyword, selectSite) {
	// keyword: anime title; sectSite = [{path: "website.save.anime", regExp: "website.save.anime/static"}]
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
	}).catch( error => {
		console.log(error);
		return -1;
	} );
}
async function reqTitle(urlArry) {
	const req = require("https");
	const url = require("url");
	let titleArry = [];
	let promises = [];
	urlArry.forEach( (element, index) => {
		const promise = new Promise( (resolve,reject) => {
			const reqObj = {
				hostname: url.parse(element).hostname,
				path: url.parse(element).path,
				headers: {
					"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv; 78.0) Gecko/20100101 Firefox/78.0" 
				}
			};
			const reqBody = req.request(reqObj, (response) => {
				let originData = "";
				let title = `*${index}* `;
				response.on("data", (data) => {
					originData += data;
				})
				response.on("end", () => {
					title += originData.match(/<title>(.*?)<\/title>/)[0].replace(/<title>/, "").replace(/<\/title>/, "");
					resolve(title);
				})
			})
			reqBody.on("error", (error) => {
				reject(error);
			})
			reqBody.end();
		});
		promises.push(promise);
	})
	return Promise.all(promises).then( (results) => {
		results.forEach( (element) => {
			titleArry.push(element);
		} )
		return titleArry;
	} ).catch("error", (error) => {
		console.log("Request Url Title Error:\n",error);
		return (-1);
	});
}
module.exports = {
	g_search: g_search,
	reqTitle:reqTitle
}
