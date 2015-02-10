//////onLoad stuff//////
function initAPIs() {
	initSoundcloud();
	initYoutube();
}





function initPage() { //bind jQuery event handler and do other stuff
	$("#playlistTextBar").keydown(function (e) {
		if (e.keyCode == 13) {
			loadPlaylist($("#playlistTextBar").val());
		}
	});
}

////////////////////////

//////YOUTUBE API STUFF//////
function initYoutube() {
	gapi.client.setApiKey("AIzaSyCEXDdCU08T8-e-rSuLsnGiOod-7OD5Bdw");
	gapi.client.load("youtube","v3", function() {
		alert("YouTube API loaded");
		initPage(); //after API loads, bind jQuery event handler
	});
	
}


//////SOUNDCLOUD API STUFF//////

function initSoundcloud() {
	SC.initialize({
		client_id: "04bb44568d1cbab6d74d3bc86b2819c9",
	});
	alert("Soundcloud API loaded");
}


function loadPlaylist(url) {
	SC.get("/resolve", { url: url }, function (data) {
		console.log(data);
		if (data.kind === "playlist") {
			alert("playlist");
			showPlaylist(data);
		}
		else {
			alert("Please enter a playlist");
		}
	});
}

////////////////////////////////

function showPlaylist(data) { //takes SoundCloud API's data object
	var title = data.title;
	var tracks = data.tracks;
	console.log("Playlist Title: " + title);

	for (var i = 0; i < tracks.length; i++) {
		console.log(tracks[i].title + " " + msToTime(tracks[i].duration));
	}
}

function msToTime(ms) {
	var seconds = Math.floor(ms/1000);
	var minutes = Math.floor(seconds/60);
	seconds = seconds % 60;
	return minutes + ":" + seconds;
}