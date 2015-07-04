from soundcloud_api import SCPlaylistObject
from youtube_api import YTSearchObject
from youtube_dl_functions import download
import os, sys


def isInt(s): #boolean, checks if s can be cast to int
	try:
		int(s)
		return True
	except ValueError:
		return False

def replace(index): #takes index of song that user wishes to replace, prints candidates, accepts user's value and modifies
	a.printCandidates(index, every = True)	#display all candidates
	while True:
		candidate_index = raw_input("Select the index of the preferred song.\n")
		if isInt(candidate_index) and int(candidate_index) < a.searchLength and int(candidate_index) >= 0:
			a.setSelected(index, int(candidate_index))
			a.printResults()
			break
		else:
			print "INVALID INPUT"

playlist_url = raw_input("Please enter URL of Soundcloud playlist: \n")

print "Retrieving Soundcloud playlist"

a = SCPlaylistObject(playlist_url)
a.getPlaylist() #get SC playlist

print "Searching for candidates from Youtube\n"

a.getCandidates()
a.printResults()

while True:
	index = raw_input("Select a song to edit its candidate. Type Done to exit.\n")

	if isInt(index) and int(index) < a.playlistLength() and int(index) >= 0:
		replace(int(index))
	elif index == "Done":
		print "Done"
		break
	else:
		print "NOT AN OPTION"

playlist = a.returnPlaylist()

title = a.playlistTitle

if not os.path.exists(title):
	os.makedirs(title)
else:
	print "Directory " + title + " already exists."
	sys.exit(0)

print "Converting " + str(len(playlist)) + " videos."

for x in range(0,len(playlist)):
	track = playlist[x]
	idString = track["candidates"][track["selected"]]["id"]
	download(idString, title)
	print "Complete, " + str(len(playlist)-1-x) + " remaining."
