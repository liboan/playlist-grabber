from soundcloud_api import SCPlaylistObject
from youtube_api import YTSearchObject

a = SCPlaylistObject("https://soundcloud.com/user531613781/sets/vicetone")

a.getPlaylist()
a.getCandidates()
a.printResults()
a.printCandidates(0, every = True)
# b = YTSearchObject()

# b.findVideoCandidates("vicetone heartbeat", 10)

