from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

sc = "Nicky Romero & Vicetone - Let Me Feel (ft. When We Are Wild)"

names = ["Nicky Romero & Vicetone - Let Me Feel (ft. When We Are Wild)",
"Nicky Romero & Vicetone - Let Me Feel ft. When We Are Wild (Official Music Video)",
"Nicky Romero & Vicetone - Let Me Feel (ft. When We Are Wild)",
"Nicky Romero & Vicetone ft. When We Are Wild - Let Me Feel (Acoustic Version)",
"Nicky Romero & Vicetone - Let Me Feel (Fedde Le Grand Remix)"
]

for name in names:
	print similar(sc, name)