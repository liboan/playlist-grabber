var http = require("http");
var fs = require('fs');
var url = require('url');

var server = http.createServer(function (request, response) {
	console.log("Request received");
	path = url.parse(request.url).pathname;

	if (path == "/") {
		path = "/index.html"
	}

	fs.readFile("public" + path, function (err, data) {
		if (err) {
			console.log("error sending " + path);
			response.writeHead(404);
			response.end();
		}
		else {
			console.log("Served " + path);
			response.writeHead(200);
			response.end(data);
		}
	});
});

server.listen(8080);
console.log("Server listening on port 8080");