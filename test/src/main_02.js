import $ from 'jquery'
import THREE from 'expose?THREE!three'
import radians from 'degrees-radians'
import 'OBJLoader'

// my modules
import Timeline from './timeline'

function interior(t, a, b) {
	return (t - a) / (b - a)
}

const DURATION = 3.0

class App {

	constructor() {

		this.initScene()

		window.addEventListener('resize', this.onResize.bind(this))


		this.loadKeyframes().done(() => {

			this.drawGraph()

			this.clock = new THREE.Clock()
			this.clock.start()
			this.render.bind(this)
			this.render()

		})
	}

	loadKeyframes() {
		let d = new $.Deferred

		$.when(
			$.getJSON('../data/test_timeline.json'),
			$.getJSON('../data/test_frame_animation.json')
		).done((timeline, frameAnimation) => {

			this.timeline = Timeline.parse(timeline[0])
			this.frameAnimation = frameAnimation[0]

			d.resolve()
		})

		return d.promise()
	}

	drawGraph() {

		let stage = new createjs.Stage('graph')
		let shape = new createjs.Shape()

		// shape.graphics
		// 	.beginFill('red')
		// 	.drawRect(0, 0, 120, 120)

		stage.canvas.width = window.innerWidth
		stage.canvas.height = window.innerHeight * 0.3

		let w = stage.canvas.width
		let h = stage.canvas.height

		console.log(w, h)

		let g = shape.graphics

		let len = 180, y

		for (let f = 0; f < len; f++) {

			let time = f / 60.0
			let x = f / len * w

			// frame animation

			y = interior(this.frameAnimation[f], 200, -200) * h
			g.beginFill('#d42b39')
			g.drawRect(x-1, y-1, 2, 2)
			g.endFill()

			// keyframe
			g.beginFill('#91AA9D')
			y = interior(this.timeline.cube.position_x.getValue(time), 200, -200) * h
			g.drawRect(x-1, y-1, 2, 2)
			g.endFill()
		}

		stage.addChild(shape)
		stage.update()

	}


	initScene() {

		this.scene = new THREE.Scene()

		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas'),
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight * 0.7)
		this.renderer.setClearColor( 0x193441 )

		// add object to scene
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 0.7), 1, 10000)
		this.camera.position.set(190, 150, 190)
		this.camera.rotation.set(radians(-24), radians(45), 0, 'YXZ')

		let gridHelper = new THREE.GridHelper(200, 20, 0xD1DBBD, 0x3E606F)
		this.scene.add(gridHelper)

		// light
		{
			let ambientLight = new THREE.AmbientLight(0x193441, 1.4)
			this.scene.add(ambientLight)

			let directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
			directionalLight.position.set(-20, 30, 20)
			this.scene.add(directionalLight)
		}

		// box
		{
			let geom = new THREE.BoxGeometry(20, 20, 20)
			let mat = new THREE.MeshLambertMaterial({color: 0xDF646F})

			this.cube = new THREE.Mesh(geom, mat)
			this.scene.add(this.cube)
		}

		// test
		{
			let geom = new THREE.BoxGeometry(20, 20, 20)
			let mat = new THREE.MeshBasicMaterial({color: 0xd42b39, wireframe: true})

			this.wireCube = new THREE.Mesh(geom, mat)
			this.scene.add(this.wireCube)
		}
	}

	onResize() {
		console.log('on resize')
		this.camera.aspect = window.innerWidth / (window.innerHeight * 0.7)
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight * 0.7)

		this.drawGraph()
	}

	render() {
		// console.log(this)
		requestAnimationFrame(this.render.bind(this))

		let time = this.clock.getElapsedTime() % DURATION
		let frame = Math.floor(time * 60)

		this.cube.position.x = this.timeline.cube.position_x.getValue(time)
		this.wireCube.position.x = this.frameAnimation[frame]

		this.renderer.render(this.scene, this.camera)
	}

}


new App()
