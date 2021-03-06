#youtube-dl stuff
from __future__ import unicode_literals
import youtube_dl


def download(url, directory): #accepts youtube video URL, downloads and converts the video
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
        'outtmpl': directory + '/%(title)s.%(ext)s',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'logger': MyLogger(),
        'progress_hooks': [my_hook],
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
        # for track in playlist:
        # 	url = track["candidates"][track["selected"]]["id"]
        # 	print 'https://www.youtube.com/watch?v=' + url
        # 	ydl.download(['https://www.youtube.com/watch?v=' + url])