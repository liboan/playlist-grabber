var page = require('webpage').create(), 
    system = require('system'),
    t, address;

page.onConsoleMessage = function(msg) {
    console.log("PAGE MSG: " + msg);
};

t = Date.now();

vid_url = "https://www.youtube.com/watch?v=FYyCbKZIkgc"

page.open("http://www.youtube-mp3.org", function(status) {
    if (status !== 'success') {
        console.log('FAIL to load the address');
    } else {
        page.render("test.jpg");
        page.includeJs("https://code.jquery.com/jquery-2.1.3.js", function () {
            page.evaluate(function(vid_url) {
                console.log(vid_url);
                $("#youtube-url").val(vid_url);
                $("#submit").click();  
            }, vid_url);
            waitFor(page, "#dl_link > a", (new Date()).getTime() + 10000, function () { //wait for links to load up
                page.render("test.jpg");
                var href_string = page.evaluate(function () {
                    console.log($("#dl_link > a:visible").length);
                    return $("#dl_link > a:visible").attr("href");

                });
                console.log("href_string: " + href_string);
            });
        });

    }
});

function waitFor( page, selector, expiry, callback ) { //taken from https://newspaint.wordpress.com/2013/04/05/waiting-for-page-to-load-in-phantomjs/
    system.stderr.writeLine( "- waitFor( " + selector + ", " + expiry + " )" );
 
    // try and fetch the desired element from the page
    var result = page.evaluate(
        function (selector) {
            return document.querySelector( selector );
        }, selector
    );
 
    // if desired element found then call callback after 50ms
    if ( result ) {
        system.stderr.writeLine( "- trigger " + selector + " found" );
        window.setTimeout(
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
        system.stderr.writeLine( "- timed out" );
        callback( false );
        return;
    }
 
    // haven't timed out, haven't found object, so poll in another 100ms
    window.setTimeout(
        function () {
            waitFor( page, selector, expiry, callback );
        },
        100
    );
}