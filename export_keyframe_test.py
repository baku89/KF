from common import *
from KeyframeExporter import *

dstKeyframePath = projDir + "/test/public/data/test_timeline.json"
dstFrameAnimationPath = projDir + "/test/public/data/test_frame_animation.json" 

obj = search('cube')


def exportFrameAnimation():

	data = []

	for f in xrange(180):
		setFrame(f)
		data.append(obj.GetRelPos().x)

	with open(dstFrameAnimationPath, 'w') as outFile:
		json.dump(data, outFile, indent=2)


def exportKeyframe():

	curve = obj.GetFirstCTrack().GetCurve()
	keyframe = generateKeyframeData(curve)

	data = {
		"cube": {
			"position_x": {
				"type": "float",
				"components": [keyframe]
			}
		}
	}

	with open(dstKeyframePath, 'w') as outFile:
		json.dump(data, outFile, indent=2)



def main():
	clearConsole()

	exportFrameAnimation()
	exportKeyframe()

	print "Finished!"

if __name__=='__main__':
	main()