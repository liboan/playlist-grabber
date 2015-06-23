#class for the Soundcloud API methods

import soundcloud
from youtube_api import YTSearchObject

class SCPlaylistObject(object):
	"""docstring for SCPlaylistObject"""
	def __init__(self, url):
		self.client = soundcloud.Client(client_id = "04bb44568d1cbab6d74d3bc86b2819c9")
		self.url = url
		self.results = []

		self.ytSearcher = YTSearchObject()

	def getPlaylist(self):
		data = self.client.get("/resolve", url = self.url)
		if data.kind == "playlist":
			self.results = data.tracks
			for track in self.results: #trim down track objects to just duration, title, and urls
				temp_title = track["title"]
				temp_duration = track["duration"]/1000
				temp_url = track["permalink_url"]
				track.clear()
				track["title"] = temp_title
				track["duration"] = temp_duration
				track["url"] = temp_url
				track["candidates"] = [] #start with empty list of candidates and populate 
				track["selected"] = 0 #index of YT vid that will be downloaded, can be set by user

		else:
			print "ERROR: Url does not point to a playlist"

	def getCandidates(self):
		for track in self.results:
			track["candidates"] = self.ytSearcher.findVideoCandidates(track["title"], 10)


	def printResults(self):
		if len(self.results) == 0:
			print "Results haven't been gotten yet."
		else:
			for x in range(0,len(self.results)):
				track = self.results[x]
				string = str(x).ljust(2) + " " + str(track["duration"]).ljust(5) + " " + track["title"].ljust(40)[0:40] + " " + self.printCandidates(x, track["selected"])
				print string

	def printCandidates(self, index, every = False, selected = 0): #print the candidates. if every = False, return the first one.
		if len(self.results) == 0 or len(self.results[index]["candidates"]) == 0:
			print "---"
		else: 
			if every:
				print "/"*15 + " Candidates for index " + str(index) + " " + "/"*15
				for x in range(0,len(self.results[index]["candidates"])):
					track = self.results[index]["candidates"][x]
					string = str(x).ljust(2) + " " + str(track["duration"]).ljust(5) + " " + track["title"].ljust(40)[0:40]
					print string
			else:
				track = self.results[index]["candidates"][selected]
				return str(selected).ljust(2) + " " + str(track["duration"]).ljust(5) + " " + track["title"].ljust(40)[0:40]
