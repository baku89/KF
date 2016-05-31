import c4d

def getDividingRatio(value, minValue, maxValue):
	return (value - minValue) / (maxValue - minValue)

class KeyframeExporter:

	"""A simple keyframe exporter for c4d"""
	def __init__(self, curve):

		self.keyframes = []
		self.curve = curve

		for i in xrange(curve.GetKeyCount()):
			key = curve.GetKey(i)
			time = float(key.GetTime().Get())
			timeLeft = float(key.GetTimeLeft().Get())
			timeRight = float(key.GetTimeRight().Get())

			self.keyframes.append({
				"interpolation": key.GetInterpolation(),
				"value": key.GetValue(),
				"time":	time,
				"value_left": key.GetValueLeft(),
				"time_left": timeLeft,
				"value_right": key.GetValueRight(),
				"time_right": timeRight
			})

	# def normalizeTime():
	# 	timeMin = curve.GetKey(0).GetTime().Get()
	# 	timeMax = curve.GetKey(keyNum - 1).GetTime().Get()

	# 	for key in self.keyframes:
	# 		key["time"] = getDividingRatio(key["time"], timeMin, timeMax)
	# 		key["time_left"] = getDividingRatio(key["time_left"], timeMin, timeMax)
	# 		key["time_right"] = getDividingRatio(key["time_right"], timeMin, timeMax)
