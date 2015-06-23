#class for the youtube api methods

from apiclient.discovery import build

class YTSearchObject(object):
	def __init__(self):
		self.youtube = build("youtube", "v3",
		developerKey = "AIzaSyCEXDdCU08T8-e-rSuLsnGiOod-7OD5Bdw")
		
	def findVideoCandidates(self, query, n): # accepts query string and runs a search, returning 1st n results
		search_response = self.youtube.search().list(
			q=query,
			part="id,snippet",
			type="video",
			maxResults=n
			).execute()

		tagString = ""

		for item in search_response["items"]: #reduce each dict to only the important information
			title = item["snippet"]["title"]
			tag = item["id"]["videoId"]
			item.clear()
			item["title"] = title.encode("utf-8")
			item["id"] = tag
			tagString = tagString + tag + "," #add video tag to comma-separated list

		duration_list = self.youtube.videos().list( #find the duration for each of the videos
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

	