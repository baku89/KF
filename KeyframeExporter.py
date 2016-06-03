import c4d

def interior(value, minValue, maxValue):
	return (value - minValue) / (maxValue - minValue)

def generateKeyframeData(curve):

	data = []
	num = curve.GetKeyCount()

	for i in xrange(num):

		key = curve.GetKey(i)
		interpolation = key.GetInterpolation()

		time = key.GetTime().Get()
		value = key.GetValue()

		if i == num - 1 or interpolation == c4d.CINTERPOLATION_STEP:

			data.append([time, value])

		elif interpolation == c4d.CINTERPOLATION_SPLINE:

			nextKey = curve.GetKey(i + 1)

			td = nextKey.GetTime().Get() - time
			vd = nextKey.GetValue() - value

			x1 = key.GetTimeRight().Get() / td
			y1 = key.GetValueRight() / vd
			x2 = nextKey.GetTimeLeft().Get() / td + 1.0
			y2 = nextKey.GetValueLeft() / vd + 1.0

			data.append([time, value, x1, y1, x2, y2])

		elif interpolation == c4d.CINTERPOLATION_LINEAR:

			data.append([time, value, 0, 0, 1, 1])

	return data







