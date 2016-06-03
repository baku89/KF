import _ from 'lodash'
import Keyframe from './keyframe'

class Timeline {

	constructor() {}

	parse(timeline) {
		_.each(timeline, (obj) => {
			_.each(obj, (track, trackName) => {

				let keyframes

				if (track.components.length > 1) {
					track.components.forEach((keyframe) => {
						keyframes.push(new Keyframe(keyframe))
					})
				} else {
					keyframes = new Keyframe(track.components[0])
				}

				obj[trackName] = keyframes
			})
		})

		return timeline
	}

}


export default new Timeline()
