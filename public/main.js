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

function searchSong(query, index) { //index = index of songList on which searchSong is being called. list = songList
	var request = gapi.client.youtube.search.list({
		type: "video",
		q: query,
		part: "snippet",
		maxResults: 5
	});

	request.execute(function (response) {
		var videos = response.result.items;
		console.log(videos[0].id.videoId + " " + videos[0].snippet.title);
	});
}

function pushYTInfo(videos, index) { //pushes to songList
	songList[index].title = videos[0].snippet.title;
	songList[index].duration = 0;///FUCK WHY DO I HAVE TO MAKE ANOTHER API CALL
	songList[index].id = videos[0].id.videoId;
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

			for (var i = 0; i < data.tracks.length; i++) {
				songList.push({
					sc: { //SoundCloud info
						title: data.tracks[i].title,
						duration: Math.floor(data.tracks[i].duration/1000), // ms ==> s
						link: data.tracks[i].permalink_url
					},
					yt: { //YouTube info- left blank until search returns data
						title: "",
						duration: "",
						id: ""
					}

				});
			}


			showPlaylist(songList);
			playlistSearch(songList);
		}
		else {
			alert("Please enter a playlist");
		}
	});
}

////////////////////////////////

var songList = []; //list of songs. Each song object contains song info from SC and YT (title, time, url/id)

function showPlaylist(list) { //takes songList

	for (var i = 0; i < list.length; i++) {
		console.log(list[i].sc.title + "\t" + list[i].sc.duration);
		console.log(list[i].yt.title + "\t" + list[i].yt.duration);
		console.log("------------------------------------------------------------");
	}
}

function playlistSearch(list) { //takes songList
	for (var i = 0; i < list.length; i++) {
		searchSong(list[i].sc.title, i);
	}
}


//////ANNOYING TIME STUFF//////

function msToTime(ms) {
	var seconds = Math.floor(ms/1000);
	var minutes = Math.floor(seconds/60);
	seconds = seconds % 60;
	return minutes + ":" + seconds;
}

function hmsToSeconds(timeArray) { //returns seconds when an array from ISOtoTime() is passed in
	return 3600 * timeArray[0] + 60 * timeArray[1] + timeArray[2]; 
}

function ISOtoTime(duration) { //YouTube API returns duration in ISO 8601 format PT#H#M#S
	duration = duration.substring(2); //chop off PT
	// var h = duration.indexOf("H"); //look for hours, minutes, seconds
	// var m = duration.indexOf("M");
	// var s = duration.indexOf("S");

	var stringCheck = ["H","M","S"];

	var time = [];

	for (var i = 0; i < stringCheck.length; i++) {
		var letter = duration.indexOf(stringCheck[i]);
		if (letter != -1) {
			time.push(parseInt(duration.substring(0,letter))); //parse out the number before the letter (H,M,S)
			duration = duration.substring(letter+1);
			console.log(i + " " + duration);
		}
		else {
			time.push(0);
		}
	}
	return time;

}