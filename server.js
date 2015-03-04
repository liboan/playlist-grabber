var http = require("http");
var fs = require('fs');
var url = require('url');
var phantom = require('phantom');


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


//create phantom process
// phantom.create("--web-security=no", "--ignore-ssl-errors=yes", { port: 12345 }, function (ph) {
//     console.log("Phantom Bridge Initiated");
//     _ph = ph;

//     //create a page
//     var _page;
//     _ph.createPage(function (page) {
//     	console.log("Page created!");
//     	_page = page;
//     });

//     _page.open("http://www.youtube-mp3.org", function (status) {
//     	if (status !== "success") {
//     		console.log("Error");
//     	}
//     	else {
//     		console.log("Page open!");
//     	}
//     });
// }, {
// 	dnodeOpts: { //disable dnodeOpts as suggested by sgentle
// 		weak: false
// 	}
// });

phantom.create("--web-security=no", "--ignore-ssl-errors=yes", { port: 12345 }, function (ph) {
	console.log("Phantom Bridge Initiated");
  	ph.createPage(function (page) {
  		vid_url = "https://www.youtube.com/watch?v=FYyCbKZIkgc";
    	/* the page actions */
    	page.open("http://www.youtube-mp3.org", function (status) {
	    	if (status !== "success") {
	    		console.log("Error");
	    	}
	    	else {
	    		console.log("Page open!");
	    		page.includeJs("https://code.jquery.com/jquery-2.1.3.js", function () {
	    			page.evaluate(function(vid_url) { //evaluate callback
	    			    console.log(vid_url);
	    			    $("#youtube-url").val(vid_url);
	    			    $("#submit").click();  
	    			    return vid_url;
	    			}, function (result) { //result callback
	    				console.log("RESULT: " + result);
	    			},
	    			vid_url);


	    			waitFor(page, "#dl_link > a", (new Date()).getTime() + 10000, function () { //wait for links to load up
	    			    //page.render("test.jpg");
	    			    page.evaluate(function () {
	    			        console.log($("#dl_link > a:visible").length);
	    			        return $("#dl_link > a:visible").attr("href"); //return url

	    			    }, function (result) { //result callback
	    			    	console.log("href_string: " + result);
	    			    });
	    			});

	    		});
	    	}
	    });

  	});
}, {
  	dnodeOpts: {
    	weak: false
  	}
});


function waitFor( page, selector, expiry, callback ) { //taken from https://newspaint.wordpress.com/2013/04/05/waiting-for-page-to-load-in-phantomjs/
    console.log( "- waitFor( " + selector + ", " + expiry + " )" );
 
    // try and fetch the desired element from the page
    page.evaluate(
        function (selector) {
            return document.querySelector( selector );
        }, 
        function (result) { //changed a bit- had to write a result callback
        	// if desired element found then call callback after 50ms
        	if ( result ) {
        	    console.log( "- trigger " + selector + " found" );
        	    setTimeout(
        	        function () {
        	            callback( true );
        	        },
        	        50
        	    );
        	    return;
        	}
        	
        	// determine whether timeout is triggered
        	var finish = (new Date()).getTime();
        	if ( finish > expiry ) {
        	    console.log( "- timed out" );
        	    callback( false );
        	    return;
        	}
        	
        	// haven't timed out, haven't found object, so poll in another 100ms
        	setTimeout(
        	    function () {
        	        waitFor( page, selector, expiry, callback );
        	    },
        	    100
        	);
        },
        selector
    );
 
    
}