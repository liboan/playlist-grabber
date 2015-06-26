from soundcloud_api import SCPlaylistObject
from youtube_api import YTSearchObject
import youtube_dl


a = SCPlaylistObject("https://soundcloud.com/user531613781/sets/vicetone")

a.getPlaylist()
a.getCandidates()
a.printResults()
a.printCandidates(0, every = True)

#user interface stuff

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

#youtube-dl stuff
class MyLogger(object):
    def debug(self, msg):
        #print(msg)
        return

    def warning(self, msg):
        print(msg)

    def error(self, msg):
        print(msg)


def my_hook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')

ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'logger': MyLogger(),
    'progress_hooks': [my_hook],
}
with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    #ydl.download(['https://www.youtube.com/watch?v=FtveSk1N7Uo'])
    for track in playlist:
    	idString = track["candidates"][track["selected"]]["id"]
    	print 'https://www.youtube.com/watch?v=' + idString
    	ydl.download(['https://www.youtube.com/watch?v=' + idString])