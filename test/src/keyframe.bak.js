import CubicBezier from 'cubic-bezier'

function interior(t, a, b) {
	return (t - a) / (b - a)
}

function linear(t, a, b) {
	return a + (b - a) * t
}

export default class Keyframe {

	constructor(data) {

		this.data = []

		for (let i = 0; i < data.length; i++)  {

			let easing = null

			if (i < data.length - 1) {
				let td = data[i+1].time - data[i].time
				let vd = data[i+1].value - data[i].value


				let p1x = data[i].time_right /  td
				let p1y = data[i].value_right / vd
				let p2x = 1 + data[i+1].time_left / td
				let p2y = 1 + data[i+1].value_left / vd

				console.log(i, p1x, p1y, p2x, p2y)
				easing = CubicBezier(p1x, p1y, p2x, p2y, 0.0001)
			}

			this.data.push({
				time: data[i].time,
				value: data[i].value,
				interpolation: data[i].interpolation,
				easing: easing
			})
		}
	}

	getValueAtTime(time) {

		const len = this.data.length

		if (time < this.data[0].time) {
			return this.data[0].value
		}
		if (this.data[len - 1].time <= time ) {
			return this.data[len - 1].value
		}

		for (let i = 0; i < len - 1; i++) {
			if (this.data[i].time <= time && time < this.data[i+1].time) {

				if (this.data[i].easing) {
					let t = interior(time, this.data[i].time, this.data[i+1].time)
					let e = this.data[i].easing(t)
					return linear(e, this.data[i].value, this.data[i+1].value)
				}
				return this.data[i].value
			}
		}
	}



}
