#API tests to grab SC playlist and get search results from YT

import soundcloud

import gdata.youtube
import gdata.youtube.service

############SC TEST############

client = soundcloud.Client(client_id = "04bb44568d1cbab6d74d3bc86b2819c9")

playlist_url = "https://soundcloud.com/user531613781/sets/vicetone"

data = client.get("/resolve", url = playlist_url)

def printPlaylistDetails(data):
	if data.kind == "playlist":
		for track in data.tracks:
			print track["title"]
			print track["duration"]
			print track["permalink_url"]
			print "/////////////////////////////"
	else:
		print "NOT A PLAYLIST"


#printPlaylistDetails(data)

############YT TEST###########
from apiclient.discovery import build

YT_API_KEY = "AIzaSyCEXDdCU08T8-e-rSuLsnGiOod-7OD5Bdw"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
	developerKey = YT_API_KEY)

search_response = youtube.search().list(
	q="Vicetone - What I've Waited For",
	part="id,snippet",
	maxResults=10
	).execute()

print search_response["items"][0]["snippet"]["title"]
print search_response["items"][0]["id"]["videoId"]

def findVideoCandidates(query): # accepts query string and runs a search, returning 1st 10 results
	search_response = youtube.search().list(
		q=query,
		part="id,snippet",
		type="video",
		maxResults=10
		).execute()

	tagString = ""

	for item in search_response["items"]: #reduce each dict to only the important information
		title = item["snippet"]["title"]
		tag = item["id"]["videoId"]
		item.clear()
		item["title"] = title
		item["id"] = tag
		tagString = tagString + tag + "," #add video tag to comma-separated list

	duration_list = youtube.videos().list( #find the duration for each of the videos
		id=tagString,
		part="contentDetails"
		).execute() 

	for i in range(0,len(duration_list["items"])): #convert each duration string to seconds
		durationString = duration_list["items"][i]["contentDetails"]["duration"][2:-1] #ISO format, PT#H#M#S
		duration = 0

		if "H" in durationString:
			hIndex = durationString.index("H")
			duration = duration + 3600 * int(durationString[:hIndex])
			durationString = durationString[hIndex+1:]
		if "M" in durationString:
			mIndex = durationString.index("M")
			duration = duration + 60 * int(durationString[:mIndex])
			durationString = durationString[mIndex+1:]

		duration = duration + int(durationString)

		search_response["items"][i]["duration"] = duration #now add durations to each video entry


	return search_response["items"]

vid0 = findVideoCandidates("au5")
print vid0

#print getDuration(vid0["id"])




# yt_service = gdata.youtube.service.YouTubeService()

# yt_service.developer_key = "AIzaSyCEXDdCU08T8-e-rSuLsnGiOod-7OD5Bdw"
# yt_service.client_id = "playlist-grabber"

# query = gdata.youtube.service.YouTubeVideoQuery()
# query.vq = "Vicetone - What I've Waited For"
# query.max_results = 10

# feed = yt_service.YouTubeQuery(query)

# for i in range(1,len(feed.entry)):
# 	print feed.entry[i].media.title.text
# 	print feed.entry[i].media.duration.seconds
# 	print feed.entry[i].media.player.url
# 	print "////////////////////"