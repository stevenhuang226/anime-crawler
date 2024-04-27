function g_search(keyword, selectSite, resultLimit=30) // keyword = anime name; selectSite = websiteurl for google search
{
	const https = require("https");
	let path = "/search?q=" + encodeURIComponent(keyword) + "site%3A"
	let originResponseText;
	selectSite.forEach( (element) => {
		path += element;
	} )
	//	console.log("url=", path);
	const requestObj = {
		hostname: "www.google.com",
		path: path,
		headers: {	//header you can changer it by yourself
			//"User-Agent":"",
			"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv: 78.0) Gecko/20100101 Firefox/78.0",
		}
	}

	const requestBody = https.request( requestObj, (response) => {
		//console.log("status: ", response.statusCode); // debug
		response.on("data", (data) => {
			originResponseText += data.toString();
		})
		response.on("end", async () => {
			return await originResponseText.match(/https:\/\/myself-bbs\.com\/thread-\d{5}-\d{1}-\d{1}\.html/g).slice(0,resultLimit);
		})
	} )
	requestBody.on("error", (error) => {
		console.log("Google Search Request Error:\n", error);
		return (-1);
	})
	requestBody.end();
}


// test
