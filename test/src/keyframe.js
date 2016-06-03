// import CubicBezier from 'cubic-bezier'
import BezierEasing from 'bezier-easing'

const KEY_TIME = 0
const KEY_VALUE = 1
const KEY_X1 = 2
const KEY_Y1 = 3
const KEY_X2 = 4
const KEY_Y2 = 5

function distance(x1, x2, y1, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function interior(t, a, b) {
	return (t - a) / (b - a)
}

function linear(t, a, b) {
	return a + (b - a) * t
}

export default class Keyframe {

	constructor(data) {

		this.track = []

		let x1, y1, x2, y2, len1, len2, fac, h1x, h1y, h2x, h2y

		for (let i = 0; i < data.length; i++)  {

			let easing = null
			let key = data[i]

			if (i == data.length - 1 || key.length < 6) {
				// step interpolation

			} else {
				// bezier interpolation
				x1 = key[KEY_X1]
				y1 = key[KEY_Y1]
				x2 = key[KEY_X2]
				y2 = key[KEY_Y2]

				// if the handles cross, sclae down handles
				len1 = distance(0, 0, x1, y1)
				len2 = distance(1, 1, x2, y2)

				if (len1 + len2 > 1) {
					console.log('scale down')
					fac = 1 / (len1 + len2)

					h1x = 0 - x1
					h1y = 0 - y1
					h2x = 1 - x2
					h2y = 1 - y2

					console.log(x1, y1, x2, y2)

					x1 = 0 - fac * h1x
					y1 = 0 - fac * h1y

					x2 = 1 - fac * h2x
					y2 = 1 - fac * h2y

					console.log(x1, y1, x2, y2)
				}

				easing = BezierEasing(x1, y1, x2, y2)
			}

			this.track.push({
				time: key[KEY_TIME],
				value: key[KEY_VALUE],
				easing: easing
			})
		}
	}

	getValue(time) {

		const len = this.track.length

		if (time < this.track[0].time) {
			return this.track[0].value
		}
		if (this.track[len - 1].time <= time ) {
			return this.track[len - 1].value
		}

		for (let i = 0; i < len - 1; i++) {
			if (this.track[i].time <= time && time < this.track[i+1].time) {

				if (this.track[i].easing) {
					let t = interior(time, this.track[i].time, this.track[i+1].time)
					let e = this.track[i].easing(t)
					return linear(e, this.track[i].value, this.track[i+1].value)
				}
				return this.track[i].value
			}
		}
	}



}
