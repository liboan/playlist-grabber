//////onLoad stuff//////
function initAPIs() {

	$.ajax({
		url: "keys",
		type: "GET",
		success: function (response) {
			alert("API keys obtained");
			keys = JSON.parse(response);

			initSoundcloud(keys.sc);
			initYoutube(keys.yt);
		}
	})

}





function initPage() { //bind jQuery event handler and do other stuff
	$("#playlistTextBar").keydown(function (e) {
		if (e.keyCode == 13) {
			loadPlaylist($("#playlistTextBar").val());
			clearTable();
		}
	});
	$("#search").click(function () {
		loadPlaylist($("#playlistTextBar").val());
		clearTable();
	});

	$("#dlButton").click(function () {
		data = {
			"links": true,
		};

		for (var i = 0; i < songList.length; i++) {
			dl = songList[i].dlIndex;
			data[i] = 'https://www.youtube.com/watch?v=' + songList[i].yt[dl].id;
		}

		console.log(data);


		$.ajax({
			url: "ajax",
			type: "POST",
			contentType: 'application/json',
			data: JSON.stringify(data),
			success: function (response) {
				alert(response);
			}
		});
	});

}



////////////////////////

//////ANNOYING DISPLAY STUFF//////

function createTable(songList) {
	var table = document.createElement("table");
	for (var i = 0; i < songList.length; i++) {
		var tr = document.createElement("tr");
		for (var columns = 0; columns < 4; columns++) {
			var td = document.createElement("td");	
			if (columns == 0) { //first column, SC stuff
				td.className += "scLinks";
				time = timeString(secondsToTime(songList[i].sc.duration)); //b/c i'm dumb
				td.innerHTML = "<a href ='" + songList[i].sc.link + "' " + " target = '_blank'>" + songList[i].sc.title + "</a><br>" + time;
			}
			if (columns == 1) {
				td.className += "ytLinks";
				td.innerHTML = "Loading...";
			}
			//$(td).text("asdf");
			if (columns == 2) {
				td.innerHTML = "Prev";
				td.className += "left";
			}
			if (columns == 3) {
				td.innerHTML = "Next";
				td.className += "right";
			}

			// if (columns == 4) {
			// 	td.innerHTML = "Use your own link";
			// 	td.className += "customSearch";
			// }

			tr.appendChild(td);		
		}
		table.appendChild(tr);
	}
	document.getElementById("playlistTable").appendChild(table);

	//add hidden text input bar for each customSearch td
	$("<input type = 'text'/>")
		.attr("class", "linkBar")
		.appendTo(".customSearch")

	//event listeners for buttons, in order to traverse thru choices


	$(".left").click(function () {
		var index = $(this).parent().parent().children().index($(this).parent());
		if (songList[index].dlIndex > 0) {
			songList[index].dlIndex--; //increment youtube download variable
		}
		$(".ytLinks:eq(" + index + ")").css("background-color", "lightgreen");
		$(".customSearch:eq(" + index + ")").css("background-color", "");
		// $(".customSearch:eq(" + index + ")").children().toggle()

		tableYT(songList,index,songList[index].dlIndex);

	});
	$(".right").click(function () {
		var index = $(this).parent().parent().children().index($(this).parent());
		if (songList[index].dlIndex < songList[index].yt.length - 1) { //make sure to give it space to add
			songList[index].dlIndex++; //increment youtube download variable
		}
		$(".ytLinks:eq(" + index + ")").css("background-color", "lightgreen");
		$(".customSearch:eq(" + index + ")").css("background-color", "white");
		// $(".customSearch:eq(" + index + ")").children().toggle()

		tableYT(songList,index,songList[index].dlIndex);
	});

	// $(".customSearch").click(function () {
	// 	var index = $(this).parent().parent().children().index($(this).parent());
	// 	$(".ytLinks:eq(" + index + ")").css("background-color", "white");
	// 	$(".customSearch:eq(" + index + ")").css("background-color", "lightgreen");
	// 	// $(".customSearch:eq(" + index + ")").children().toggle()
	// })



}

function clearTable() {
	document.getElementById("playlistTable").innerHTML = "";
}

function tableYT(songList, songIndex, candidate) { //index of song in songList, index of candidate
	console.log(candidate);
	var table = document.getElementById("playlistTable").getElementsByTagName("table")[0];
	var time = timeString(secondsToTime(songList[songIndex].yt[candidate].duration));
	var string = "<a href = 'https://www.youtube.com/watch?v=" + songList[songIndex].yt[candidate].id + "' target = '_blank'>" + 
	songList[songIndex].yt[candidate].title + "</a><br>" + time;
	table.rows[songIndex].cells[1].innerHTML = string;
}

//////YOUTUBE API STUFF//////
function initYoutube(key) {
	gapi.client.setApiKey(key);
	gapi.client.load("youtube","v3", function() {
		alert("YouTube API loaded");
		initPage(); //after API loads, bind jQuery event handler
	});
	
}

function searchSong(query, index) { //index = index of songList on which searchSong is being called. 
	console.log("SEARCHING");
	var videoCount = 10; //number of videos requested

	var request = gapi.client.youtube.search.list({
		type: "video",
		q: query,
		part: "snippet",
		maxResults: videoCount
	});

	var candidates = []; //list for information of all of the candidates, added in the same form as sc objects

	request.execute(function (response) {
		var videos = response.result.items;
		//console.log(videos[0].id.videoId + " " + videos[0].snippet.title);
		for (var i = 0; i < videos.length; i++) {
			addCandidate(videos[i].snippet.title,videos[i].id.videoId); //feed info to function to do duration search
		}

	});


	function addCandidate(title, id) { 
		var durationSearch = gapi.client.youtube.videos.list({
			id: id, //search for every video id
			part: "contentDetails"
		});
		durationSearch.execute(function (response) {
			candidates.push({
				title: title,
				id: id,
				duration: hmsToSeconds(ISOtoTime(response.items[0].contentDetails.duration)),
			});


			if (candidates.length == videoCount) { //if complete
				//console.log(candidates);
				pushYTInfo(candidates, index);
			}
		});

	}

	//return candidates;
}

function pushYTInfo(candidates, index) { //pushes to songList
	console.log("COMPLETE" + candidates[0].title);
	songList[index].yt = candidates;
	completeSearches++;
	if (completeSearches == songList.length) { //if all searches have returned
		showPlaylist(songList);
		for (var i = 0; i < songList.length; i++) {
			tableYT(songList,i,0); 
		}
		$("#dlButton").show();
	}
}

function loadNextCandidate(index) {
	if (songList[index].dlIndex <= 10) {
		songList[index].dlIndex++; //increment youtube download variable
	}


}

//////SOUNDCLOUD API STUFF//////

function initSoundcloud(key) {
	SC.initialize({
		client_id: key,
	});
	alert("Soundcloud API loaded");
}


function loadPlaylist(url) {
	songList = []; //clear previous search
	completeSearches = 0;
	$("#dlButton").hide();
	SC.get("/resolve", { url: url }, function (data) {
		console.log(data);
		if (data.kind === "playlist") {

			for (var i = 0; i < data.tracks.length; i++) {
				songList.push({
					sc: { //SoundCloud info
						title: data.tracks[i].title,
						duration: Math.floor(data.tracks[i].duration/1000), // ms ==> s
						link: data.tracks[i].permalink_url
					},
					dlIndex: 0, //index of youtube vid that is supposed to be downloaded
					yt: [] //YouTube candidates, array of objects like the soundcloud object
				});
			}


			createTable(songList);
			playlistSearch(songList); //start youtube searches
		}
		else {
			alert("Please enter a playlist");
		}
	});
}

////////////////////////////////

var songList = []; //list of songs. Each song object contains song info from SC and YT (title, time, url/id)
var completeSearches = 0; //number of searches completed (and yt lists added)

function showPlaylist(list) { //takes songList

	for (var i = 0; i < list.length; i++) {
		var dl = list[i].dlIndex;
		console.log(list[i].sc.title + "\t" + list[i].sc.duration);
		console.log(list[i].yt[dl].duration + " " + list[i].yt[dl].id + " " + list[i].yt[dl].title);
		console.log("------------------------------------------------------------");
	}
}

function playlistSearch(list) { //takes songList
	for (var i = 0; i < list.length; i++) {
		searchSong(list[i].sc.title, i);
	}
}


//////ANNOYING TIME STUFF//////

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
			//console.log(i + " " + duration);
		}
		else {
			time.push(0);
		}
	}
	return time; //return array, [h,m,s]

}

function secondsToTime(seconds) {
	var time = [];
	var hours = Math.floor(seconds/3600);
	time.push(hours);
	var remainder = 0;
	if (hours > 0) {
		remainder = seconds % 3600;
	}
	else {
		remainder = seconds;
	}
	var minutes = Math.floor(remainder/60);
	time.push(minutes);
	if (minutes > 0) {
		seconds = seconds % 60;
	}
	time.push(seconds);
	return time;
}

function timeString(time) {
	var string = "";
	if (time[0] > 0) {
		if (time[0] < 10) {
			string += "0";
		}
		string += time[0] + ":";
	}

	if (time[1] < 10) {
		string += "0";
	}
	string += time[1] + ":";

	if (time[2] < 10) {
		string += "0";
	}
	string += time[2] + "";

	return string;
}