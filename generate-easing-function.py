import c4d
import os, json
from KeyframeExporter import KeyframeExporter

projDir = os.path.normpath(doc.GetDocumentPath() + "/../")

dstPath = projDir + "/test/public/data/%s_keyframes.json" % os.path.splitext(doc.GetDocumentName())[0]

def main():
	obj = doc.SearchObject('cubeParent')
	tracks = obj.GetCTracks()

	data = {}

	for track in tracks:
		curve = track.GetCurve()
		exporter = KeyframeExporter(curve)
		name = track.GetName()

		data[name] = exporter.keyframes

	# print data

	with open(dstPath, 'w') as outFile:
		json.dump(data, outFile, indent=2)

	print "Finished!"

if __name__=='__main__':
	main()