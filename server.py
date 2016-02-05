from flask import Flask, request, url_for, redirect, send_from_directory
from youtube_dl_functions import download
from api import keys
import os, sys
import json

key_string = json.dumps({"sc": keys['sc'], "yt": keys['yt']})


app = Flask(__name__, static_url_path = "")

def dlCallback(link, func):
	print "start " + link
	func(link, "download")
	print "finish " + link

@app.route("/")
def index():
	return send_from_directory("static","index.html")

@app.route("/ajax", methods=['POST'])
def ajax():
	if request.json["links"] == True:
		if not os.path.exists("download"):
			os.makedirs("download")
		for i in xrange(0, 10):
			dlCallback(request.json[str(i)], download)
		return "Success!"

	else:
		return "No links sent to server."

@app.route("/keys", methods=['GET'])
def keys():
	return key_string

if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=True)